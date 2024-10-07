import { describe, it, expect } from 'vitest'
import { getSteps, transformRegExpToPartial } from './helpers.js'
import { flatten } from 'lodash-es'

let matchTester = [
  {
    regex: transformRegExpToPartial(/^test$/),
    matches: [
      '',
      't',
      'te',
      'tes',
      'test',
    ],
    misses: [
      'x',
      'tx',
      'tex',
      'tesx',
      'testx',
      'test ',
    ]
  },
  {
    regex: transformRegExpToPartial(/^I scroll (down|up|left|right) (\d*)(?:px| pixels?)$/),
    matches: [
      'I ',
      'I scr',
      'I scroll ',
      'I scroll do',
      'I scroll down',
      'I scroll down ',
      'I scroll u',
      'I scroll up ',
      'I scroll up 5',
      'I scroll lef',
      'I scroll left',
      'I scroll left 45',
      'I scroll righ',
      'I scroll right ',
      'I scroll right 67234',
      'I scroll down 1',
      'I scroll down 1p',
      'I scroll down 1px',
      'I scroll down 1 ',
      'I scroll down 1 pix',
      'I scroll down 1 pixels',
      'I scroll down 123456789',
    ],
    misses: [
      'scroll',
      'I scroll h',
      'I scroll  ',
      'I scroll 24',
      'I scroll down 24 px',
      'I scroll down 24 pixels ',
    ]
  }
]

describe('RegExp partial matching', () => {
  for (let tester of matchTester) {
    describe(tester.regex.source, () => {
      for (let match of tester.matches) {
        it(`matches ${match}`, () => {
          expect(tester.regex.test(match)).toBe(true)
        })
      }
      for (let miss of tester.misses) {
        it(`does not match ${miss}`, () => {
          expect(tester.regex.test(miss)).toBe(false)
        })
      }
    })
  }
})