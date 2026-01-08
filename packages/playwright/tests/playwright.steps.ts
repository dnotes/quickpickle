import { Given, When, Then, DocString, DataTable, AfterAll, After, Before, BeforeAll } from 'quickpickle'
import type { PlaywrightWorld, PlaywrightWorldConfig, PlaywrightWorldConfigSetting } from '../src/PlaywrightWorld'
import { expect } from '@playwright/test'
import http from 'node:http'
import fs from 'node:fs'

// Global server manager to handle server lifecycle across multiple test files
class ServerManager {
  private static instance: ServerManager
  private server: http.Server | null = null
  private port = 8087
  private refCount = 0

  static getInstance(): ServerManager {
    if (!ServerManager.instance) {
      ServerManager.instance = new ServerManager()
    }
    return ServerManager.instance
  }

  async startServer(): Promise<void> {
    this.refCount++

    if (this.server) {
      // Server already running, just increment reference count
      return
    }

    return new Promise((resolve, reject) => {
      this.server = http.createServer((req, res) => {
        res.writeHead(200, { 'Content-Type': 'text/plain' })
        res.end('Hello, world!')
      })

      this.server.listen(this.port, '127.0.0.1', () => {
        console.log(`Test server started on port ${this.port}`)
        resolve()
      })

      this.server.on('error', (err: any) => {
        if (err.code === 'EADDRINUSE') {
          console.warn(`Port ${this.port} already in use, assuming server is already running`)
          this.server = null // Mark as not managed by us
          resolve()
        } else {
          reject(err)
        }
      })
    })
  }

  async stopServer(): Promise<void> {
    this.refCount--

    if (this.refCount > 0 || !this.server) {
      // Still have references or server not managed by us
      return
    }

    return new Promise((resolve) => {
      this.server!.close(() => {
        console.log('Test server stopped')
        this.server = null
        resolve()
      })
    })
  }

  getPort(): number {
    return this.port
  }
}

const serverManager = ServerManager.getInstance()

Given('the following world config:', async (world:PlaywrightWorld, rawConf:DocString|DataTable) => {
  let config:PlaywrightWorldConfigSetting
  if (rawConf instanceof DataTable)
    config = rawConf.rowsHash()
  else config = rawConf?.data ?? {}
  await world.reset(config)
})

// IndexedDB
Given('(there is )a(n) (indexed)db record for {string} with value {string}', async (world:PlaywrightWorld, key:string, value:string) => {
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
Then('error {int} should not/NOT contain {string}', async (world, idx, expected) => {
  await expect(world.info.errors[idx-1].message).not.toContain(expected)
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

// Network
Given('the network latency is {int}ms', async function (world:PlaywrightWorld, latency:number) {
  // Create a CDP Session
  const client = await world.page.context().newCDPSession(world.page);
  await client.send('Network.emulateNetworkConditions', {
    offline: false,
    downloadThroughput: (15 * 1024 * 1024) / 8,   // 15 Mbps to byte/s
    uploadThroughput: (3 * 1024 * 1024) / 8,      // 3 Mbps to byte/s
    latency,
  });
});

BeforeAll(async () => {
  await serverManager.startServer()
})

Before('@webserver', async (world:PlaywrightWorld) => {
  world.worldConfig.host = 'http://127.0.0.1'
  world.worldConfig.port = serverManager.getPort()
})

AfterAll(async () => {
  await serverManager.stopServer()
})

After('@screenshot', async (world:PlaywrightWorld) => {
  await world.screenshot()
})