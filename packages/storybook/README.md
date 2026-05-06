# QuickPickle Storybook

## Tags

In Gherkin syntax, all tags are arbitrary, the meaning to be determined by the 
test framework's implmentation. QuickPickle implements some tags that map to 
Vitest functionality, like "@skip" and "@fails", and the Storybook extension 
also implements a few tags as listed below:

### Storybook parameters

- layout:
  - `@centered` -> `{ layout: 'centered' }`
  - `@fullscreen` -> `{ layout: 'fullscreen' }`
  - `@padded` -> `{ layout: 'padded' }`

### Storybook tags

All Cucumber tags are also passed through as Storybook tags. For example, `@autodocs`,
`@experimental`, or `@deprecated` in a feature file become `autodocs`, `experimental`,
and `deprecated` tags in Storybook metadata.

Storybook already recognizes several built-in tags, including `dev`, `manifest`, `test`,
`autodocs`, `play-fn`, and `test-fn`. See the official Storybook tags documentation:
[https://storybook.js.org/docs/writing-stories/tags](https://storybook.js.org/docs/writing-stories/tags).