import { VitestBrowserWorld } from "../VitestBrowserWorld";
import { render, cleanup } from 'vitest-browser-vue'
import type { TestContext } from "vitest";
import type { InfoConstructor } from "quickpickle/dist/world";

export class VueBrowserWorld extends VitestBrowserWorld {

  renderFn = render
  cleanupFn = cleanup

  constructor(context:TestContext, info:InfoConstructor) {
    super(context, info)
  }

  async render(name:string|any, props?:any, renderOptions?:any) {
    let mod = typeof name === 'string'
      ? await import(`${this.fullPath(`${this.worldConfig.componentDir}/${name}`)}` /* @vite-ignore */ )
      : name;
    let component = mod.default ?? mod;
    await this.renderFn(component, { props, ...renderOptions })
  };

}
