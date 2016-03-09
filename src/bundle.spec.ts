import test = require('blue-tape')
import Promise = require('any-promise')
import { join } from 'path'
import { bundle } from './bundle'
import { VERSION } from './typings'
import { rimraf } from './utils/fs'
import { EventEmitter } from 'events'

const emitter = new EventEmitter()

test('bundle', t => {
  t.test('bundle everything', t => {
    const FIXTURE_DIR = join(__dirname, '__test__/bundle')

    return rimraf(join(FIXTURE_DIR, 'out'))
      .then(() => {
        return bundle({
          cwd: FIXTURE_DIR,
          name: 'example',
          out: join(FIXTURE_DIR, 'out'),
          ambient: false,
          emitter
        })
      })
      .then(function (data) {
        t.equal(data.main, [
          `// Generated by typings`,
          `// Source: custom_typings/test.d.ts`,
          `declare module \'~example~test\' {`,
          `export function test (): string;`,
          `}`,
          ``,
          `// Generated by typings`,
          `// Source: index.d.ts`,
          `declare module \'~example/index\' {`,
          `export { test } from \'~example~test\'`,
          `}`,
          'declare module \'example/index\' {',
          'export * from \'~example/index\';',
          '}',
          'declare module \'example\' {',
          'export * from \'~example/index\';',
          '}',
          ''
        ].join('\n'))
      })
  })
})
