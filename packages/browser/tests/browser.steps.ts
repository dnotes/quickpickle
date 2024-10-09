import { Given, When, Then, DataTable } from "quickpickle";
import { QuickPickleWorld } from "../../main/src/world";

import { page, commands, server } from '@vitest/browser/context'

When('I go to {string}', async (world:QuickPickleWorld,url) => {
  await commands.readFile(url)
})

Then('I should see {string}', async (world:QuickPickleWorld,text) => {
  await page.getByText(text)
})