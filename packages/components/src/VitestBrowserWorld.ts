import { normalizeTags, QuickPickleWorld, QuickPickleWorldInterface } from 'quickpickle';

class VitestBrowserWorld implements QuickPickleWorldInterface {
  rendered: { [key: string]: any } = {};

  constructor() {
    // Initialize the rendered property as an empty object
    this.rendered = {};
  }

  // Method to set rendered components
  setRendered(key: string, value: any) {
    this.rendered[key] = value;
  }

  // Method to get rendered components
  getRendered(key: string): any {
    return this.rendered[key];
  }

  // Method to clear rendered components
  clearRendered() {
    this.rendered = {};
  }
}
