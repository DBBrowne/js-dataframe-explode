function isIterable(obj){
  // checks for null and undefined 
  // eslint-disable-next-line eqeqeq
  if (obj == null) {
    return false
  }
  return typeof obj[Symbol.iterator] === 'function'
}
function isListLike(obj) {
  return isIterable(obj) && 'string' !== typeof obj
}

function elementsExplodableAcrossBases(target, explodeBases, index){
  const comparisonElement = target[explodeBases[0]][index]

  const comparisonIterable = isListLike(comparisonElement)
  const iterableMatch = explodeBases.every(function(base){
    let lengthMatch = true
    if (comparisonIterable){
      lengthMatch = comparisonElement.length === target[base][index].length
    }
    return (
      lengthMatch &&
      comparisonIterable === isListLike(target[base][index])
    )
  })
  return iterableMatch
}

/**
 * Explode an object of arrays, based on explodeBases.
 * @param {Object} target - DataFrame to explode.
 * @param {string[]} [explodeBases=Object.getOwnPropertyNames(myDataFrame)[0]] - property names to base explosion upon.
 * @param {boolean} [ignoreIndex=false] - By default, trackingIndex records the original index of the input list. True for trackingIndex to match the index of the exploded list.
 * @param {boolean} [omitIndex=false] - true to omit tracking index entirely.
 * 
 * @returns {Object} Exploded DataFrame with trackingIndex.
 */
function explode(target, explodeBases, ignoreIndex = false, omitIndex = false){
  const props = Object.getOwnPropertyNames(target)
  const out = {}
  let trackingIndex = 0

  // checks for null and undefined 
  // eslint-disable-next-line eqeqeq
  if (!explodeBases || null == explodeBases[0]){
    explodeBases = [props[0]]
  }

  props.forEach(function (prop){
    out[prop] = []
  })
  if (!omitIndex){
    out['trackingIndex'] = []
  }

  explodeBases.forEach(function(base){
    if (!isListLike(target[base])){
      throw new Error(`explodeBase ${base} is not list-like`)
    }
  })

  target[explodeBases[0]].forEach(function (
    elementInProperty, elementIndex
  ){
    if (!elementsExplodableAcrossBases(target, explodeBases, elementIndex)){
      const nonmatchingElements = explodeBases.map(function(base){
        return `${base} : ${target[base][elementIndex]}`
      })
      throw new Error(`Elements to explode do not match at index ${elementIndex}.\n${nonmatchingElements.join('\n')}`)
    }

    if (out['trackingIndex']){
      const length = isListLike(elementInProperty) ? elementInProperty.length : 1

      for (let j = 0;j < length;j++){
        out['trackingIndex'].push(trackingIndex)
        if (ignoreIndex) trackingIndex++
      }
    }
    if (!ignoreIndex) trackingIndex++
  })

  props.forEach(function(propToAppendTo){
    const targetProp = target[propToAppendTo]
    if (explodeBases.includes(propToAppendTo)){
      out[propToAppendTo] = targetProp.flat()
      return
    }
      
    out[propToAppendTo] = target[explodeBases[0]].map(function (_el, i){
      const length = isListLike(target[explodeBases[0]][i]) ? target[explodeBases[0]][i].length : 1

      const fill = isListLike(target[propToAppendTo]) ? target[propToAppendTo][i] : target[propToAppendTo]

      return Array(length).fill(fill)
    }).flat()
  })
  
  return out
}

module.exports = explode
