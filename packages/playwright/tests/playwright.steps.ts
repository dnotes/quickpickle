import { Given, When, Then, DocString, DataTable, AfterAll, After } from 'quickpickle'
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

// IndexedDB
Given('a(n) (indexed)db record for {string} with value {string}', async (world:PlaywrightWorld, key:string, value:string) => {
  await world.page.evaluate(async ([key, value]) => {
    return new Promise<void>((resolve, reject) => {
      const request = indexedDB.open('testing', 1);

      // Initialize database schema if needed
      request.onupgradeneeded = (event) => {
        const db = (event.target as IDBRequest).result;
        if (!db.objectStoreNames.contains('testing')) {
          db.createObjectStore('testing', { keyPath: 'key' });
        }
      };

      request.onsuccess = (event) => {
        const db = (event.target as IDBRequest).result;
        const transaction = db.transaction('testing', 'readwrite');
        const store = transaction.objectStore('testing');
        const putRequest = store.put({ key, value });

        putRequest.onsuccess = () => {
          db.close();
          resolve();
        };

        putRequest.onerror = () => {
          db.close();
          reject(new Error('Failed to store record'));
        };
      };

      request.onerror = (event) => {
        reject(new Error('Error opening database: ' + ((event.target as IDBRequest)?.error?.message ?? 'unknown error')));
      };
    });
  }, [key, value]);
})
Then('the (indexed)db record for {string} should be {string}', async (world:PlaywrightWorld, key:string, value:string) => {
  const result = await world.page.evaluate(async ([key]) => {
    return new Promise<any>((resolve, reject) => {
      const request = indexedDB.open('testing', 1);

      // Initialize database schema if needed (in case this runs without Given step)
      request.onupgradeneeded = (event) => {
        const db = (event.target as IDBRequest).result;
        if (!db.objectStoreNames.contains('testing')) {
          db.createObjectStore('testing', { keyPath: 'key' });
        }
      };

      request.onsuccess = (event) => {
        const db = (event.target as IDBRequest).result;
        const transaction = db.transaction('testing', 'readonly');
        const store = transaction.objectStore('testing');
        const getRequest = store.get(key);

        getRequest.onsuccess = () => {
          db.close();
          resolve(getRequest.result);
        };

        getRequest.onerror = () => {
          db.close();
          reject(new Error('Failed to get record'));
        };
      };

      request.onerror = (event) => {
        reject(new Error('Error opening database: ' + ((event.target as IDBRequest)?.error?.message ?? 'unknown error')));
      };
    });
  }, [key]);

  expect(result).toEqual({ key, value });
})

// Errors
Then('error {int} should contain {string}', async (world, idx, expected) => {
  await expect(world.info.errors[idx-1].message).toContain(expected)
})
Then('clear error {int}', async (world, idx) => {
  world.info.errors.splice(idx-1, 1)
})
Then('clear {int} error(s)', async (world, idx) => {
  world.info.errors.splice(0, idx)
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

After('@screenshot', async (world:PlaywrightWorld) => {
  await world.screenshot()
})