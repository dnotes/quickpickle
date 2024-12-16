import { Given, When, Then, DocString, DataTable, AfterAll } from 'quickpickle'
import type { PlaywrightWorld, PlaywrightWorldConfig, PlaywrightWorldConfigSetting } from '../src/PlaywrightWorld'
import yaml from 'js-yaml'
import { expect } from '@playwright/test'

import path from 'node:path'
import url from 'node:url'
export const projectRoot = path.resolve(path.dirname(url.fileURLToPath(import.meta.url)), '..')
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
  console.log('world config', world.worldConfig)
})

// Filesystem
Then('the file {string} should exist(--delete it)', async function (world:PlaywrightWorld, filepath:string) {
  let fullpath = world.sanitizeFilepath(`${projectRoot}/${filepath}`)
  await expect(fs.existsSync(fullpath)).toBeTruthy();
  if (world.info.step?.match(/--delete it$/)) fs.unlinkSync(fullpath)
})
Then('the file {string} should not exist', async function (world:PlaywrightWorld, filepath:string) {
  let fullpath = world.sanitizeFilepath(`${projectRoot}/${filepath}`)
  await expect(fs.existsSync(fullpath)).toBeFalsy();
})
