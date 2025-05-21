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
    await expect(commands.readFile(fullpath)).toBeTruthy();
    throw new Error(`Screenshot ${filepath} should not exist`)
  }
  catch(e) {
    if (e.message === `Screenshot ${filepath} should not exist`) throw e
  }
})
