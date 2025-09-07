import { Before, Then, When } from 'quickpickle'
import type { VitestBrowserWorld } from '../../src/VitestBrowserWorld'
import { expect } from 'vitest'
import { commands } from '@vitest/browser/context'



// Screenshots
Then('the screenshot {string} should exist(--delete it)', async function (world:VitestBrowserWorld, filepath:string) {
  let fullpath = world.fullPath(`${world.screenshotDir}/${filepath}.png`)
  await expect(commands.readFile(fullpath)).toBeTruthy();
  if (world.info.step?.match(/--delete it$/)) await commands.removeFile(fullpath)
})
Then('the screenshot {string} should/does not exist', async function (world:VitestBrowserWorld, filepath:string) {
  let fullpath = world.fullPath(`${world.screenshotDir}/${filepath}.png`)
  try {
    await commands.readFile(fullpath);
    throw new Error(`Screenshot ${filepath} should not exist`)
  }
  catch(e) {
    if (!e.message.match(/ENOENT/i)) throw e
  }
})
Then('(the )error {int} should contain {string}', async (world, idx, expected) => {
  let error = world.info.errors[idx-1]
  await expect(error.message).toContain(expected)
})
Then('(the )error {int} should contain the following text:', async (world, idx, expected) => {
  let error = world.info.errors[idx-1]
  await expect(error.message).toContain(expected.toString())
})
Then('the stack for error {int} should contain {string}', async (world, idx, expected) => {
  let stack = world.info.errors[idx-1].stack.split('\n')[0]
  await expect(stack).toContain(expected)
})
Then('there should have been {int} error(s)', async (world:VitestBrowserWorld, int:number) => {
  expect(world.info.errors.length).toBe(int)
  world.info.errors = []
})
When('headings have a {word} background', async (world:VitestBrowserWorld, color:string) => {
  await world.page.getByRole('heading').all().map(el => {
    el.element().setAttribute('style', `background-color: ${color};`)
  })
})