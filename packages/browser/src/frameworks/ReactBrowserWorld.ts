import { VitestBrowserWorld } from "../VitestBrowserWorld";
import { render, cleanup } from 'vitest-browser-react'
import type { TestContext } from "vitest";
import type { InfoConstructor } from "quickpickle/dist/world";
import React from 'react';
import { defaultsDeep } from 'lodash-es'

export const defaultReactOptions = {
  /**
   * The default extension to use when rendering components
   * (if none is provided in the step)
   */
  defaultComponentExtension: 'tsx',
}

export type ReactWorldConfigSetting = Partial<typeof defaultReactOptions>

export class ReactBrowserWorld extends VitestBrowserWorld {

  renderFn = render
  cleanupFn = cleanup

  constructor(context:TestContext, info:InfoConstructor) {
    info.config.worldConfig = defaultsDeep(info.config.worldConfig, defaultReactOptions)
    super(context, info)
  }

  async render(name:string|any, props?:any, renderOptions?:any) {
    let Component:any;
    // Set the default extension if not provided
    if (typeof name === 'string' && !name.match(/\.[jt]sx?$/))
      name += '.' + this.worldConfig.defaultComponentExtension;
    if (typeof name === 'string') {
      // dynamic import returns the module object
      let mod = await import(`${this.fullPath(`${this.worldConfig.componentDir}/${name}`)}` /* @vite-ignore */ )
      // try .default first, then fall back to any other export
      Component = mod.default ?? Object.values(mod)[0];
      if (!Component) {
        throw new Error(
          `Could not find a React component export in module "${name}".`
        );
      }
    } else {
      Component = name;
    }

    // now call reactRender with the actual component
    let result = await render(React.createElement(Component, props), renderOptions);
    this.page = result.container;
  }

  async cleanup() { await cleanup(); }

}
