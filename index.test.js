/* eslint-disable key-spacing */
const explode = require('./index.js')

describe('js-dataframe-explode', ()=>{
  describe('explodes a DataFrame-like object', ()=>{
    it('retaining the tracking index', ()=>{
      const input = {
        A: [[0,1,2], 'foo', ['hi'], [3,4]],
        B: [      1,     2,      3,    4 ],
        C: [      2,     3,      4,    5 ],
      }
      const columnsToExplode = ['A']

      const out = explode(input, columnsToExplode)

      const expected = {
        A:  [0, 1, 2, 'foo', 'hi', 3, 4],
        B:  [1, 1, 1,     2,    3, 4, 4],
        C:  [2, 2, 2,     3,    4, 5, 5],
        trackingIndex:
            [0, 0, 0,     1,    2, 3, 3],
      }

      expect(out).toStrictEqual(expected)
    })
    it('basing the tracking index on the output', ()=>{
      const input = {
        A: [[0,1,2], 'foo', ['hi'], [3,4]],
        B: [      1,     2,      3,    4 ],
        C: [      2,     3,      4,    5 ],
      }
      const columnsToExplode = ['A']
      const ignoreIndex = true

      const out = explode(input, columnsToExplode, ignoreIndex)

      const expected = {
        A:  [0, 1, 2, 'foo', 'hi', 3, 4],
        B:  [1, 1, 1,     2,    3, 4, 4],
        C:  [2, 2, 2,     3,    4, 5, 5],
        trackingIndex:
            [0, 1, 2,     3,    4, 5, 6],
      }

      expect(out).toStrictEqual(expected)
    })
    it('omitting the tracking index with "omitIndex=true"', ()=>{
      const input = {
        A: [[0,1,2], 'foo', ['hi'], [3,4]],
        B: [      1,     2,      3,    4 ],
        C: [      2,     3,      4,    5 ],
      }
      const columnsToExplode = ['A']
      const omitIndex = true

      const out = explode(input, columnsToExplode, null, omitIndex)

      const expected = {
        A:  [0, 1, 2, 'foo', 'hi', 3, 4],
        B:  [1, 1, 1,     2,    3, 4, 4],
        C:  [2, 2, 2,     3,    4, 5, 5],
      }

      expect(out).toStrictEqual(expected)
    })
    it('with primitive reference values', ()=>{
      const input = {
        A: [[0,1,2], 'foo', ['hi'], [3,4]],
        B: 2,
        C: 'a',
      }
      const columnsToExplode = ['A']

      const out = explode(input, columnsToExplode)

      const expected = {
        A:  [  0,   1,   2, 'foo', 'hi',   3,   4],
        B:  [  2,   2,   2,     2,    2,   2,   2],
        C:  ['a', 'a', 'a',   'a',  'a', 'a', 'a'],
        trackingIndex:
            [0,     0,   0,     1,    2,    3,  3],
      }

      expect(out).toStrictEqual(expected)
    })
    describe('inferring a property to explode if', ()=>{
      it('none is provided',()=>{
        const input = {
          A: [[0,1,2], 'foo', ['hi'], [3,4]],
          B: 2,
        }
  
        const out = explode(input)
  
        const expected = {
          A:  [0, 1, 2, 'foo', 'hi', 3, 4],
          B:  [2, 2, 2,     2,    2, 2, 2],
          trackingIndex:
              [0, 0, 0,     1,    2, 3, 3],
        }
  
        expect(out).toStrictEqual(expected)
      })
      it('an empty list is provided',()=>{
        const input = {
          A: [[0,1,2], 'foo', ['hi'], [3,4]],
          B: 2,
        }
        const columnsToExplode = []

        const out = explode(input, columnsToExplode)
  
        const expected = {
          A:  [0, 1, 2, 'foo', 'hi', 3, 4],
          B:  [2, 2, 2,     2,    2, 2, 2],
          trackingIndex:
              [0, 0, 0,     1,    2, 3, 3],
        }
  
        expect(out).toStrictEqual(expected)
      })
    })
    it('based on an empty list',()=>{
      const input = {
        A: [],
        B: 2,
      }
      const explodeBases = ['A']

      const out = explode(input, explodeBases)

      const expected = {
        A:  [],
        B:  [],
        trackingIndex:
            [],
      }

      expect(out).toStrictEqual(expected)
    })
  })
  describe('throws on invalid inputs:', ()=>{
    it('non-matching multi-column explode elements',()=>{
      const input = {
        A: [   [0, 1, 2, 4], 'foo', [],     [3, 4]],
        B: 1,
        C: [['a', 'b', 'c'],   NaN, [], ['d', 'e']],
      }
      const explodeBases = ['A', 'C']

      const nonmatchingElements = explodeBases.map(function(base){
        return `${base} : ${input[base][0]}`
      }).join('\n')

      const expectedThrowAtIndex = 0
      const expectedError = new Error(`Elements to explode do not match at index ${expectedThrowAtIndex}.\n${nonmatchingElements}`)

      expect(function () {
        return explode(input, explodeBases)
      }).toThrowError(expectedError)
    })
    it('attempting to explode a non-iterable',()=>{
      const input = {
        A: [   [0, 1, 2, 4], 'foo', [],     [3, 4]],
        B: 1,
        C: [['a', 'b', 'c'],   NaN, [], ['d', 'e']],
      }
      const explodeBases = ['B']

      const expectedThrowWithBase = explodeBases[0]
      const expectedError = new Error(`explodeBase ${expectedThrowWithBase} is not list-like`)

      expect(function () {
        explode(input, explodeBases)
      }).toThrowError(expectedError)
    })
  })


  describe('matches pandas.DataFrame.explode docs', ()=>{
    const input = {
      A: [      [0, 1, 2], 'foo', [],     [3, 4]],
      B: 1,
      C: [['a', 'b', 'c'],   NaN, [], ['d', 'e']],
    }
    it('single-column example', ()=>{
      const out = explode(input)
  
      const expected = {
        A:  [0, 1, 2, 'foo', undefined, 3, 4],
        B:  [1, 1, 1,     1,    1, 1, 1],
        C:  [['a', 'b', 'c'],['a', 'b', 'c'], ['a', 'b', 'c'], NaN, [], ['d', 'e'], ['d', 'e']],
        trackingIndex:
            [0, 0, 0,     1,    2, 3, 3],
      }
      expect(out).toStrictEqual(expected)
    })
    it('multi-column example', ()=>{
      const columnsToExplode = ['A', 'C']
      const out = explode(input, columnsToExplode)
  
      const expected = {
        A:  [0,     1,   2, 'foo', undefined,   3,   4],
        B:  [1,     1,   1,     1,         1,   1,   1],
        C:  ['a', 'b', 'c',   NaN, undefined, 'd', 'e'],
        trackingIndex:
            [0, 0, 0,     1,    2, 3, 3],
      }
      expect(out).toStrictEqual(expected)
    })
  })
})

describe('js-dataframe-explode',()=>{
  it('handles null in base property',()=>{
    const input = {
      A: [[null,1,null]],
      B: [1],
    }
    const columnsToExplode = ['A']

    const out = explode(input, columnsToExplode)

    const expected = {
      A:  [null, 1, null],
      B:  [1,    1,    1],
      trackingIndex:
            [0, 0, 0],
    }

    expect(out).toStrictEqual(expected)
  })
  it('handles null in reference property',()=>{
    const input = {
      A: [[0,1,2]],
      B: [[1, null, 2]],
    }
    const columnsToExplode = ['A', 'B']

    const out = explode(input, columnsToExplode)

    const expected = {
      A:  [0,    1, 2],
      B:  [1, null, 2],
      trackingIndex:
            [0, 0, 0],
    }

    expect(out).toStrictEqual(expected)
  })
})
