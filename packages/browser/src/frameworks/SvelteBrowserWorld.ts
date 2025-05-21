import { VitestBrowserWorld } from "../VitestBrowserWorld";
import { render, cleanup } from 'vitest-browser-svelte';
import type { TestContext } from "vitest";
import { InfoConstructor } from "quickpickle/dist/world";

export class SvelteBrowserWorld extends VitestBrowserWorld {

  constructor(context:TestContext, info:InfoConstructor) {
    super(context, info)
  }

  async render(name:string|any, props?:any, renderOptions?:any) {
    if (typeof name === 'string' && !name.match(/\.svelte$/)) name += '.svelte'
    let component = typeof name === 'string'
      ? await import(`${this.fullPath(`${this.worldConfig.componentDir}/${name}`)}` /* @vite-ignore */ )
      : name
    let result = await render(component, props, renderOptions)
    this.page = result.container
  };

  async cleanup() { await cleanup(); }

}
