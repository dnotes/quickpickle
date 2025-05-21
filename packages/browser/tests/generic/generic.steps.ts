import { Before, Then } from 'quickpickle'
import type { VitestBrowserWorld } from '../../src/VitestBrowserWorld'
import { expect } from 'vitest'
import { commands } from '@vitest/browser/context'



// Screenshots
Then('the screenshot {string} should exist(--delete it)', async function (world:VitestBrowserWorld, filepath:string) {
  let fullpath = world.fullPath(`${world.screenshotDir}/${filepath}`)
  await expect(commands.readFile(fullpath)).toBeTruthy();
  if (world.info.step?.match(/--delete it$/)) await commands.removeFile(fullpath)
})
Then('the screenshot {string} should not exist', async function (world:VitestBrowserWorld, filepath:string) {
  let fullpath = world.fullPath(`${world.screenshotDir}/${filepath}`)
  try {
    await commands.readFile(fullpath);
    throw new Error(`Screenshot ${filepath} should not exist`)
  }
  catch(e) {
    if (!e.message.match(/ENOENT/i)) throw e
  }
})
Then('there should have been {int} error(s)', async (world:VitestBrowserWorld, int:number) => {
  expect(world.info.errors.length).toBe(int)
  world.info.errors = []
})