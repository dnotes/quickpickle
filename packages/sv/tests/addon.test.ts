import { expect } from '@playwright/test';
import fs from 'node:fs';
import path from 'node:path';
import addon from '../src/index.js';
import { setupTest } from './setup/suite.js';

const { test, testCases } = setupTest(
	{ addon },
	{
		kinds: [{ type: 'default', options: { [addon.id]: {} } }],
		filter: (testCase) => testCase.variant.includes('kit'),
		browser: false,
	}
);

test.concurrent.for(testCases)('@quickpickle/sv $kind.type $variant', async (testCase, ctx) => {
	const cwd = ctx.cwd(testCase);
	const ext = fs.existsSync(path.resolve(cwd, 'vite.config.ts')) ? 'ts' : 'js';

	const vscodeSettings = fs.readFileSync(path.resolve(cwd, '.vscode/settings.json'), 'utf8');
	expect(vscodeSettings).toContain('"cucumber.glue"');
	expect(vscodeSettings).toContain('"cucumberautocomplete.steps"');

	const e2eConfig = fs.readFileSync(path.resolve(cwd, `vitest.config.e2e.${ext}`), 'utf8');
	expect(e2eConfig).toContain("name: 'e2e'");
	expect(e2eConfig).toContain("include: ['./tests/**/*.feature']");

	const stepsFile = fs.readFileSync(path.resolve(cwd, `tests/e2e.steps.${ext}`), 'utf8');
	expect(stepsFile).toContain("Then('the tests should work'");

	const featureFile = fs.readFileSync(path.resolve(cwd, 'tests/front.feature'), 'utf8');
	expect(featureFile).toContain('Scenario: Viewing the front page');
	expect(featureFile).toContain('Then I should see a "Svelte" heading');

	const viteConfigPath = path.resolve(cwd, `vite.config.${ext}`);
	const viteConfig = fs.readFileSync(viteConfigPath, 'utf8');
	expect(viteConfig).toContain('vitest/config');
	expect(viteConfig).toContain('forceRerunTriggers');
	expect(viteConfig).toContain(`./vitest.config.e2e.${ext}`);

	expect(fs.existsSync(path.resolve(cwd, 'tests/front.feature'))).toBe(true);
});
