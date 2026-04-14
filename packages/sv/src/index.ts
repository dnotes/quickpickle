import type { ArrayExpression } from 'estree';
import { defineAddon, defineAddonOptions } from 'sv';
import { dedent, transforms } from './sv-utils.js';

const options = defineAddonOptions().build();

function arrayHasStringLiteral(arr: ArrayExpression, value: string): boolean {
	for (const el of arr.elements) {
		if (el && el.type === 'Literal' && el.value === value) return true;
	}
	return false;
}

export default defineAddon({
	id: '@quickpickle/sv',
	shortDescription: 'behavioral testing using Cucumber in Vitest',
	homepage: 'https://github.com/dnotes/quickpickle',
	options,

	setup: ({ isKit, unsupported, dependsOn }) => {
		if (!isKit) unsupported('Requires SvelteKit');
		dependsOn('vitest');
	},

	run: ({ sv, isKit, language, file }) => {
		const ext: 'js' | 'ts' = language === 'ts' ? 'ts' : 'js';

		sv.devDependency('quickpickle', '^1.11.0');
		sv.devDependency('@quickpickle/playwright', '^1.2.0');
		sv.devDependency('vitest', '^4.0.10');
		sv.devDependency('playwright', '^1.56.0');

		sv.file(
			file.package,
			transforms.json(({ data, json }) => {
				json.packageScriptsUpsert(data, 'test', 'vitest');
				json.packageScriptsUpsert(data, 'test:e2e', 'vitest --project e2e');
			})
		);

    // Vitest project configuration for e2e tests
		sv.file(
			`vitest.config.e2e.${ext}`,
			transforms.text(({ content }) => {
				return content ? false : dedent`
					import { defineProject } from 'vitest/config';
					import { quickpickle } from 'quickpickle';
			
					export default defineProject({
						plugins: [
							quickpickle({
								explodeTags: [
									['nojs', 'js'],
									['dark', 'light'],
									['chromium', 'firefox', 'webkit'],
									['mobile', 'tablet', 'desktop', 'widescreen']
								],
								worldConfig: {
									port: 5173,
									screenshotOptions: {
										mask: ['img'],
										maskColor: 'violet'
									}
								}
							})
						],
						test: {
							name: 'e2e',
							include: ['./tests/**/*.feature'],
							setupFiles: ['./tests/e2e.steps.${ext}']
						}
					});
				`;
			})
		);

		sv.file(
			`tests/e2e.steps.${ext}`,
			transforms.text(({ content }) => {
				if (content) return false;
				let world = ext === 'ts' ? 'world:PlaywrightWorld' : 'world';
				return dedent`
					import '@quickpickle/playwright/world';
					import '@quickpickle/playwright/actions';
					import '@quickpickle/playwright/outcomes';
					import { Given, When, Then, After } from 'quickpickle';
					${ext === 'ts' ? `import type { PlaywrightWorld } from '@quickpickle/playwright';` : ''}

					After(async function (${world}) {
						if (world.info.errors.length) {
							world.worldConfig.screenshotDir = 'errors'
							await world.screenshot()
						}
					});
				
					Then('the tests should work', async function (${world}) {
						// Add your custom step implementations here
					});
				`;
			})
		);

		sv.file(
			'tests/front.feature',
			transforms.text(({ content }) => {
				return content ? false : 	dedent`
					Feature: Front page
					
						As a user
						I want to see the front page
						So that I can verify the application works
			
						@js${isKit ? ' @nojs' : ''}
						Scenario: Viewing the front page
							Given I visit "/"
							Then I should see a "Svelte" heading
							And the tests should work
			
						@dark @light @todo
						Scenario: Front page accessibility
							Given I visit "/"
							Then all accessibility tests should pass
				`;
			})
		);

		sv.file(
			'.vscode/settings.json',
			transforms.json(({ data }) => {
				data['cucumber.glue'] = ['**/*.steps.{ts,js,mjs}'];
				data['cucumberautocomplete.steps'] = [
					'**/*.steps.{ts,js,mjs}',
					'**/node_modules/@quickpickle/playwright/**/*.steps.mjs'
				];
			})
		);

		const projects = [`./vitest.config.e2e.${ext}`];
		const forceRerunTriggers = ['**/src/**'];

		sv.file(
			file.viteConfig,
			transforms.script(({ ast, js }) => {
				const viteConfig = js.vite.getConfig(ast);

				const testObject = js.object.property(viteConfig, {
					name: 'test',
					fallback: js.object.create({
						expect: {
							requireAssertions: true
						}
					})
				});

				const forceRerunTriggersArray = js.object.property(testObject, {
					name: 'forceRerunTriggers',
					fallback: js.array.create()
				});
        for (let trigger of forceRerunTriggers) {
          if (!arrayHasStringLiteral(forceRerunTriggersArray, trigger)) {
            js.array.append(forceRerunTriggersArray, trigger);
          }
        }

				const projectsArray = js.object.property(testObject, {
					name: 'projects',
					fallback: js.array.create()
				});
				for (let project of projects) {
					if (!arrayHasStringLiteral(projectsArray, project)) {
						js.array.append(projectsArray, project);
					}
				}

				const importName = 'defineConfig';
				const { statement, alias } = js.imports.find(ast, { name: importName, from: 'vite' });
				if (statement) {
					js.imports.addNamed(ast, { imports: { defineConfig: alias }, from: 'vitest/config' });
					js.imports.remove(ast, { name: importName, from: 'vite', statement });
				}
			})
		);
	}
});
