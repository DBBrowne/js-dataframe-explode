# JS-DataFrame-Explode

Javascript / Node implementation of [Python's Pandas DataFrame#explode](https://pandas.pydata.org/docs/reference/api/pandas.DataFrame.explode.html).

[![Test](https://github.com/DBBrowne/js-dataframe-explode/actions/workflows/test.yml/badge.svg)](https://github.com/DBBrowne/js-dataframe-explode/actions/workflows/test.yml)  [![Release](https://github.com/DBBrowne/js-dataframe-explode/actions/workflows/release.yml/badge.svg)](https://github.com/DBBrowne/js-dataframe-explode/actions/workflows/release.yml)

## Contents
- [JS-dataframe-Explode](#js-dataframe-explode)
- [Demos](#demos)
- [Usage](#usage)
- [Running Tests](#running-tests)
- [Known Issues](#known-issues)

### Demos
```js
const explode = require('@dbbrowne/js-dataframe-explode')

const dataFrame = {
  A: [[0, 1, 2], 'foo', [], [3, 4]],
  B: 1,
  C: [['a', 'b', 'c'], NaN, [], ['d', 'e']]
}

const singleColumnExplode = explode(dataFrame, ['A'])
console.log(singleColumnExplode)
```
-->>
```console
{
  A:[            0,            1,            2,'foo',undefined,        3,        4],
  B:[            1,            1,            1,    1,        1,        1,        1],
  C:[['a','b','c'],['a','b','c'],['a','b','c'],  NaN,       [],['d','e'],['d','e']],
  trackingIndex:
    [0, 0, 0,     1,    2, 3, 3],
}
```
```js
const doubleColumnExplode = explode(dataFrame, ['A', 'C'])
console.log(doubleColumnExplode)
```
-->>
```console
{
  A:[  0,     1,   2, 'foo', undefined,   3,   4],
  B:[  1,     1,   1,     1,         1,   1,   1],
  C:['a',   'b', 'c',   NaN, undefined, 'd', 'e'],
  trackingIndex:
    [  0,     0,   0,     1,         2,   3,   3],
}
```

### Usage
```js
const explode = require('@dbbrowne/js-dataframe-explode')

// your DataFrame (an object with own properties that are list-likes or primitives)
const myDataFrame = {
    A: [...]
  foo: [...]
    b: 'bar'
    1: {foo:'bar'}
  '2': 'three'
}

explode(
  myDataFrame, 
  explodeBases, // Bases to explode.  Default = Object.getOwnPropertyNames(myDataFrame)[0]
  ignoreIndex,  // By default, trackingIndex records the original index of the input list. True for trackingIndex to match the index of the exploded list. Default=false
  omitIndex     // true to omit tracking index entirely. Default=false
)
```

```console
npm i @dbbrowne/js-dataframe-explode
```
myfile.js :
```js
const explode = require('@dbbrowne/js-dataframe-explode')

const dataFrame = myDataFrame

var explodedDefaultColumn = explode(dataFrame)
var singleColumnExplode   = explode(dataFrame, ['C'])
var multipleColumnExplode = explode(dataFrame, ['A','C'])
```

### Running Tests
```console
npm run test
```
-->>
```console
> @dbbrowne/js-dataframe-explode@1.0.0 test
> jest

 PASS  ./index.test.js
  js-dataframe-explode
    ✓ handles null in base property
    ✓ handles null in reference property (2 ms)
    explodes a DataFrame-like object
      ✓ retaining the tracking index (1 ms)
      ✓ basing the tracking index on the output
      ✓ omitting the tracking index with "omitIndex=true" (1 ms)
      ✓ with primitive reference values
      ✓ based on an empty list (1 ms)
      inferring a property to explode if
        ✓ none is provided
        ✓ an empty list is provided
    throws on invalid inputs:
      ✓ non-matching multi-column explode elements (8 ms)
      ✓ attempting to explode a non-iterable
    matches pandas.DataFrame.explode docs
      ✓ single-column example
      ✓ multi-column example (1 ms)

Test Suites: 1 passed, 1 total
Tests:       13 passed, 13 total
```
### Known Issues

Please report any issues, or open a PR!

 - tests to prove behaviour for dataframe prop with {1:[...], 'bar':[...], B: {foo:'bar'}}