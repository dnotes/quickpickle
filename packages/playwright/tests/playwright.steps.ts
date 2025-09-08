import { Given, When, Then, DocString, DataTable, AfterAll } from 'quickpickle'
import type { PlaywrightWorld, PlaywrightWorldConfig, PlaywrightWorldConfigSetting } from '../src/PlaywrightWorld'
import yaml from 'js-yaml'
import { expect } from '@playwright/test'

import fs from 'fs'

Given('the following world config:', async (world:PlaywrightWorld, rawConf:DocString|DataTable) => {
  let config:PlaywrightWorldConfigSetting
  if (rawConf instanceof DataTable)
    config = rawConf.rowsHash()
  else if (rawConf.mediaType.match(/^json/))
    config = JSON.parse(rawConf.toString())
  else if (rawConf.mediaType.match(/^ya?ml$/))
    config = yaml.load(rawConf.toString())
  else if (rawConf.match(/\s*\{/))
    config = JSON.parse(rawConf.toString())
  else config = yaml.load(rawConf.toString())
  await world.reset(config)
})

// Screenshots
Then('the screenshot {string} should exist(--delete it)', async function (world:PlaywrightWorld, filepath:string) {
  let fullpath = world.fullPath(`${world.screenshotDir}/${filepath}`)
  await expect(fs.existsSync(fullpath)).toBeTruthy();
  if (world.info.step?.match(/--delete it$/)) fs.unlinkSync(fullpath)
})
Then('the screenshot {string} should not exist', async function (world:PlaywrightWorld, filepath:string) {
  let fullpath = world.fullPath(`${world.screenshotDir}/${filepath}`)
  await expect(fs.existsSync(fullpath)).toBeFalsy();
})
