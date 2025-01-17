const { quickpickle } = require('quickpickle')

module.exports = [
  {
    plugins: [quickpickle()],
    test: {
      name: 'commonjs-main',
      include: ['tests/quickpickle/**/*.feature'],
      setupFiles: 'tests/quickpickle.steps.js',
      testTimeout: 5000,
    }
  },
  {
    plugins: [quickpickle()],
    test: {
      name: 'commonjs-playwright',
      include: ['tests/playwright/**/*.feature'],
      setupFiles: ['tests/playwright.steps.js'],
      testTimeout: 5000,
    }
  }
]
