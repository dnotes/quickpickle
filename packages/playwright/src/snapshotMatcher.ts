import { expect as playwrightExpect, ExpectMatcherState } from '@playwright/test';
import type { Page, Locator } from 'playwright-core';
import { PNG } from 'pngjs';
import { promises as fs } from 'node:fs';
import path from 'node:path';
import pixelmatch, { PixelmatchOptions } from 'pixelmatch';
import { defaultsDeep } from 'lodash-es';
import type { PageScreenshotOptions } from 'playwright-core';

export interface ToHaveScreenshotOptions extends PixelmatchOptions {

  // Options for the comparison
  maxDiffPercentage?: number;

  // Options for the screenshot
  clip?: {
    x: number;
    y: number;
    width: number;
    height: number;
  };
  fullPage?: boolean;
  mask?: Array<Locator|string>;
  maskColor?: string;
  omitBackground?: boolean;
  timeout?: number;

};

export interface ScreenshotSetting extends PixelmatchOptions {
  maxDiffPercentage?: number;
  clip?: {
    x?: number
    y?: number
    width?: number
    height?: number
  }
  fullPage?: boolean
  mask?: string[]
  maskColor?: string
  omitBackground?: boolean
  timeout?: number
}

export const defaultScreenshotOptions = {
  // Options for the comparison
  maxDiffPercentage: 0,

  // Options for the screenshot
  fullPage: true,
  omitBackground: false,
  mask: [],
  maskColor: '#555555',
  timeout: 5000,

  // Options for pixelmatch
  threshold: 0.1,
  alpha:0.6,
};
type _DefaultOptions = Omit<typeof defaultScreenshotOptions, "mask"> & { mask: Array<Locator> };
type _ToHaveScreenshotOptions = Omit<ToHaveScreenshotOptions, keyof _DefaultOptions> & _DefaultOptions;

async function compareImages(actual: Buffer, expected: Buffer, opts:_ToHaveScreenshotOptions): Promise<{ pass: boolean; diffPercentage: number, image: PNG }> {
  const actualImage = PNG.sync.read(actual);
  const expectedImage = PNG.sync.read(expected);
  const { width, height } = actualImage;
  const diffImage = new PNG({ width, height });

  const mismatchedPixels = pixelmatch(actualImage.data, expectedImage.data, diffImage.data, width, height, opts);

  const totalPixels = width * height;
  const diffPercentage = (mismatchedPixels / totalPixels) * 100;
  const pass = diffPercentage <= opts.maxDiffPercentage;

  return { pass, diffPercentage, image: diffImage };
}

async function customToHaveScreenshot(
  this: ExpectMatcherState,
  pageOrLocator: Page | Locator,
  snapshotPath: string,
  opts?: Partial<ToHaveScreenshotOptions>,
): Promise<{ pass: boolean; message: () => string }> {
  const options = defaultsDeep(opts, defaultScreenshotOptions);
  const pathparts = snapshotPath.split('/');
  const name = pathparts.pop();
  const screenshotDir = pathparts.join('/');
  const filepath = path.join(screenshotDir, name || '');

  const actualScreenshot = await pageOrLocator.screenshot(options);
  try {
    let expectedScreenshot: Buffer;

    try {
      expectedScreenshot = await fs.readFile(snapshotPath);
    } catch (error) {
      // If the snapshot doesn't exist, save the current screenshot and pass the test
      await fs.mkdir(screenshotDir, { recursive: true });
      await fs.writeFile(snapshotPath, actualScreenshot);
      return {
        pass: true,
        message: () => `Screenshot saved as new snapshot: ${snapshotPath}`,
      };
    }

    const { pass, diffPercentage, image } = await compareImages(actualScreenshot, expectedScreenshot, options);

    if (!pass) {
      const filepath = path.join(screenshotDir, name || '');
      await fs.mkdir(screenshotDir, { recursive: true });
      await fs.writeFile(`${filepath}.diff.png`, PNG.sync.write(image));
      await fs.writeFile(`${filepath}.actual.png`, actualScreenshot)
      return {
        pass: false,
        message: () => `Screenshot does not match the snapshot.\nDiff percentage: ${diffPercentage.toFixed(2)}%\nDiff image saved at: ${filepath}.(diff|actual).png`,
      };
    }

    return {
      pass: true,
      message: () => `Screenshot matches the snapshot: ${snapshotPath}`,
    };
  } catch (error:any) {
    await fs.mkdir(screenshotDir, { recursive: true });
    await fs.writeFile(`${filepath}.actual.png`, actualScreenshot)
    return {
      pass: false,
      message: () => `Failed to compare screenshots: ${error.message}`,
    };
  }
}

// Extend the global expect interface
declare global {
  namespace PlaywrightTest {
    interface Matchers<R> {
      toMatchScreenshot(nameOrOptions?: string | Partial<ToHaveScreenshotOptions>, optOptions?: Partial<ToHaveScreenshotOptions>): Promise<R>;
    }
  }
}

// Override the default implementation
playwrightExpect.extend({
  /**
   * A custom matcher to check if a screenshot matches a snapshot.
   * @param received the page or locator to take the screenshot from
   * @param nameOrOptions the name of the screenshot or the options for the screenshot
   * @param optOptions the options for the screenshot
   * @returns the result of the screenshot comparison
   * @deprecated Use world.expectScreenshotMatch instead
   */
  async toMatchScreenshot(received: Page | Locator, nameOrOptions?: string | Partial<ToHaveScreenshotOptions>, optOptions?: Partial<ToHaveScreenshotOptions>) {
    const name = typeof nameOrOptions === 'string' ? nameOrOptions : 'screenshot';
    const options = typeof nameOrOptions === 'object' ? nameOrOptions : optOptions;
    if (options?.mask) {
      options.mask = options.mask.map((stringOrLocator) => {
        return typeof stringOrLocator !== 'string' ? stringOrLocator : received.locator(stringOrLocator);
      });
    }
    return customToHaveScreenshot.call(this, received, name, options);
  },
});
