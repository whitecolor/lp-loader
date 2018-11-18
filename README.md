# LP-Loader for Webpack

> Frictionless *Language Packs* for apps loaded and bundled with Webpack. Keeping and loading any kind of dictionary data dynamically on demand in pure, conscious and flexible way.

*Works with Webpack 3 and 4.*

## Why

Because all the methods of i18n of JS frontend apps (particularly loading/delivering language-specific, usually ui-related data) I've manage to find out there - just ~~suck~~ could not suit my really basic requirements. Feels like **no one knows how to make it right.** So, this package is a try to approach the problem in a bit opinionated but at the same time simple, flexible and general way. This approach also turned to be useful for loading any kind of dictionary-like data sets.

*Note that LP-Loader is still experimental and may probably fail to handle some particular cases (esp. if not aligned with proposed principles). But the concept has been proven and battle tested.*

## What it does

#### Simple example of bundling language packs.

Say you have tree components in your application that you going to bundle with webpack.

```
- app/A
- app/B
- app/C
```
For every component you have specific language dictionary (folder with language files):

```
app/A/dict/
  en.json
  ru.json

app/B/dict/
  en.json
  ru.json

app/C/dict/
  en.json
  ru.json
```

Say due to your app config webpack produces two bundles: 
- `bundle-AB` - contains `A` and `B` components 
- `bundle-C` - separate bundle that contains `C` component.

Using `LP-Loader` you will get separate bundles for corresponding dictionaries:

```
bundle-AB.en.lp.js  - will contain `ru` dictionaries for A and B
bundle-AB.ru.lp.js  - will contain `en` dictionaries for A and B

bundle-C.en.lp.js   - will contain `ru` dictionaries for C
bundle-C.ru.lp.js   - will contain `en` dictionaries for C
```

Particular language bundle **will be loaded dynamically on demand** when it will be accessed from it's parent bundle code. If language is not used, language data bundles are not loaded.

As stated above, `LP-Loader` can be used to bundle this way not only language specific dictionaries, but **any *labeled* sets of *data* or *code*** that should be loaded dynamically on demand.

## Installation

![npm (scoped)](https://img.shields.io/npm/v/lp-loader.svg?maxAge=86400)


```
yarn add lp-loader [--dev]
```

## Configuration

This is the example with TypeScript based dictionaries, so you have to have following files:

```
app/A/
  A.ts        - component file
app/A/dict/
  en.ts      - dict for `english` language
  ru.ts      - dict for `russian` language
  index.ts   - lp-index file

```

You need to have an index file (`app/A/dict/index.ts`) for each of your dictionary folder. This file may be empty in case of `JS`, but it should exist anyway. It's bundled content will be generated while build by `lp-loader`. 

In case of `TS` to have correct and useful dictionary typings code like this should be put inside:

```ts
type Dict = { /* Here goes a dictionary structure */ }

declare const getDict: (lang: string) => Promise<Dict>

export default getDict
```

Then you just import this file in your apps code, and use it like this:

```ts
import getDict from './dict'

let lang = 'en'

// this is how you access dictionary data for particular language
getDict(lang).then(dict => ...)
```

In `webpack.config` you should define loader for index files:

```ts
    {
      test: /dict(\\|\/)index.ts/, loaders: [
        { loader: 'lp-loader', options: { name: 'language.pack' } },
        // determine transform loaders for lp-index files:
        { loader: 'ts-loader', options: tsLoaderOptions }
      ]
    },
    {
      test: /\.ts$/,
      loader: 'ts-loader',
      // dont forget to exclude lp-index files from general loader rules:
      exclude: [/dict(\\|\/)index.ts/], 
      options: tsLoaderOptions
    },
```

[*You may want to look at the example app's code.*](./app)

## Loader options:

```ts
export interface LoaderOptions {
  /**
   * Name of particular label kind, default is `lp`
   * Should use different names for different kinds of content.
   * Label name should not contain dots.
   */
  name?: string,
  /**
   * Custom promise library name to be imported. 
   */
  promiseLib?: string,
  /**
   * Target ES format for exporting loading function.
   * Default is es6.
   */
  exportTarget?: 'es5' | 'es6'
  /**
   * Default is `exports.default = ...`
   * If you seet empty string then export will be `exports = ` for ES5 format
   */
  exportName?: string
  /**
   * 
   * Match labeled files (tests full path), RegExp or function, 
   * By default index.* files are excluded, you may override it with this option.
   */
  include?: RegExp | ((filePath: string) => boolean),
  /**
 * 
 * Do not consider folders as labeled data. By default `false`
 */
  excludeFolders?: boolean
}
```

[*There are example configs in corresponding webpackX folders*](./webpack4/webpack.config.ts). Actually no difference between Webpack 3 and 4.

## How it works

It is quite simple. Loader finds chunk parents of the dictionary index, and generates special code to allow loading requested dictionary data on demand (via `Promise` based API).

[*You may want to look at the loader's code.*](./src/lp-loader.ts)

## Licence

WTF.