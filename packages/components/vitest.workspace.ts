export default [{
  test: {
    include: [ 'tests/*.feature' ],
    setupFiles: [ 'tests/browser.steps.ts' ],
    environment: 'jsdom',
    browser: {
      enabled: true,
      name: 'chromium',
      provider: 'playwright',
      ui: true,
    }
  }
}]
