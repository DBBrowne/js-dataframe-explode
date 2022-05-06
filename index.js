function isIterable(obj){
  // checks for null and undefined
  if (obj == null) {
    return false;
  }
  return typeof obj[Symbol.iterator] === 'function';
}
function isListLike(obj) {
  return isIterable(obj) && 'string' !== typeof obj
}

function elementsExplodableAcrossBases(target, explodeBases, index){
  const comparisonElement = target[explodeBases[0]][index]

  const comparisonIterable = isListLike(comparisonElement)
  const iterableMatch = explodeBases.every(function(base){
    let lengthMatch = true
    if(comparisonIterable){
      lengthMatch = comparisonElement.length === target[base][index].length
    }
    return (
      lengthMatch &&
      comparisonIterable === isListLike(target[base][index])
    )
  })
  return iterableMatch
}

// explodeBase is optional,
// however there is no guarantee that the 
// first listed property of an object is consistent
function explode(target, explodeBases, ignoreIndex = false, omitIndex = false){
  const props = Object.getOwnPropertyNames(target)
  const out = {}
  let trackingIndex = 0

  if(!explodeBases || null == explodeBases[0]){
    explodeBases = [props[0]]
  }

  props.forEach(function (prop){
    out[prop] = []
  })
  if(!omitIndex){
    out['trackingIndex'] = []
  }

  explodeBases.forEach(function(base){
    if(!isListLike(target[base])){
      throw new Error(`explodeBase ${base} is not list-like`)
    }
  })

  target[explodeBases[0]].forEach(function (
    elementInProperty, elementIndex
    ){
      if(!elementsExplodableAcrossBases(target, explodeBases, elementIndex)){
        const nonmatchingElements = explodeBases.map(function(base){
          return `${base} : ${target[base][elementIndex]}`
        })
        throw new Error(`Elements to explode do not match at index ${elementIndex}.\n${nonmatchingElements.join('\n')}`)
      }
      
      let targetElement = elementInProperty
      if ( !Array.isArray(targetElement) ){
        targetElement = [targetElement]
      }
      if(0 === targetElement.length){
        targetElement = [undefined]
      }
      
      targetElement.forEach(function(_el, index){
        props.forEach(function(propToAppendTo){
          let valToAppend = target[propToAppendTo][elementIndex]

          if(isListLike(valToAppend) && explodeBases.includes(propToAppendTo)) {
            out[propToAppendTo].push(valToAppend[index])
            return
          }

          if(null == valToAppend){
            valToAppend = target[propToAppendTo]
          }
          out[propToAppendTo].push(valToAppend)
        })

        out['trackingIndex']?.push(trackingIndex)
        if(ignoreIndex) trackingIndex++
      })

      if(!ignoreIndex) trackingIndex++
  })

  return out
}

module.exports = explode
