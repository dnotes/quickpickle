import { VitestBrowserWorld } from "../VitestBrowserWorld";
import { render, cleanup } from 'vitest-browser-react'
import type { TestContext } from "vitest";
import type { InfoConstructor } from "quickpickle/dist/world";
import React from 'react';

export class ReactBrowserWorld extends VitestBrowserWorld {

  renderFn = render
  cleanupFn = cleanup

  constructor(context:TestContext, info:InfoConstructor) {
    super(context, info)
  }

    // override VitestBrowserWorld.render
  async render(name: string | any, props?: any, renderOptions?: any) {
    let Component: any;

    if (typeof name === 'string') {
      // dynamic import returns the module object
      let mod = typeof name === 'string'
        ? await import(`${this.fullPath(`${this.worldConfig.componentDir}/${name}`)}` /* @vite-ignore */ )
        : name;
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
    await this.renderFn(React.createElement(Component, props), renderOptions);
  }

}
