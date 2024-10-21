import { Given, When, Then, DocString, DataTable, AfterAll } from 'quickpickle'
import type { PlaywrightWorld } from '../src/PlaywrightWorld'
import yaml from 'js-yaml'
import { expect } from '@playwright/test'
import { sanitizeFilepath } from '../src/helpers'

import path from 'node:path'
import url from 'node:url'
export const projectRoot = path.resolve(path.dirname(url.fileURLToPath(import.meta.url)), '..')
import fs from 'fs'

Given('the following world config:', async (world:PlaywrightWorld, rawConf:DocString|DataTable) => {
  if (rawConf instanceof DataTable)
    world.reset(rawConf.rowsHash())
  else if (rawConf.mediaType.match(/^json/))
    world.reset(JSON.parse(rawConf.toString()))
  else if (rawConf.mediaType.match(/^ya?ml$/))
    world.reset(yaml.load(rawConf.toString()))
  else if (rawConf.match(/\s*\{/))
    world.reset(JSON.parse(rawConf.toString()))
  else world.reset(yaml.load(rawConf.toString()))
})

// Filesystem
Then('the file {string} should exist(--delete it)', async function (world:PlaywrightWorld, filepath:string) {
  let fullpath = sanitizeFilepath(`${projectRoot}/${filepath}`)
  await expect(fs.existsSync(fullpath)).toBeTruthy();
  if (world.info.step?.match(/--delete it$/)) fs.unlinkSync(fullpath)
})
Then('the file {string} should not exist', async function (world:PlaywrightWorld, filepath:string) {
  let fullpath = sanitizeFilepath(`${projectRoot}/${filepath}`)
  await expect(fs.existsSync(fullpath)).toBeFalsy();
})
