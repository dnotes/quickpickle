import { Before, type QuickPickleWorldInterface } from "quickpickle";
import { VitestBrowserWorld } from "../VitestBrowserWorld";
import { render, cleanup } from 'vitest-browser-svelte'
import type { TestContext } from "vitest";
import { InfoConstructor } from "quickpickle/dist/world";

export class SvelteBrowserWorld extends VitestBrowserWorld {

  renderFn = render
  cleanupFn = cleanup

  constructor(context:TestContext, info:InfoConstructor) {
    super(context, info)
  }

}
