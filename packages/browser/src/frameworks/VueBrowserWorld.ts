import { VitestBrowserWorld } from "../VitestBrowserWorld";
import { render, cleanup } from 'vitest-browser-vue'
import type { TestContext } from "vitest";
import type { InfoConstructor } from "quickpickle/dist/world";

export class VueBrowserWorld extends VitestBrowserWorld {

  constructor(context:TestContext, info:InfoConstructor) {
    super(context, info)
  }

  async render(name:string|any, props?:any, renderOptions?:any) {
    if (typeof name === 'string' && !name.match(/\.vue$/)) name += '.vue'
    let mod = typeof name === 'string'
      ? await import(`${this.fullPath(`${this.worldConfig.componentDir}/${name}`)}` /* @vite-ignore */ )
      : name;
    let component = mod.default ?? mod;
    let result = await render(component, { props, ...renderOptions })
    this.page = result.container
  };

  async cleanup() { await cleanup(); }

}
