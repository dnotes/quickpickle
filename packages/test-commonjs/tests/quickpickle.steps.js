const { setWorldConstructor, defineParameterType, Given, When, Then } = await import('quickpickle')
const { QuickPickleWorld }  = await import('quickpickle')
const { expect } = await import('vitest')

// Define custom parameter type for foo|bar
defineParameterType({
  name: 'foobar',
  regexp: /(foo|bar)/,
})

class CustomWorld extends QuickPickleWorld {
  constructor(context, info, worldConfig = {}) {
    super(context, info, worldConfig)
    this.customData = { foobar:'foo' }
  }

  async init() {
    await super.init()
    // Add custom initialization logic
    this.customData.startTime = Date.now()
  }
}

setWorldConstructor(CustomWorld)

Then('foobar should be {foobar}', async function (world, expectedFoobar) {
  await expect(world.customData.foobar).to.equal(expectedFoobar)
})
