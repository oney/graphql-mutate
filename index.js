function compositeKey(path) {
  return reverseKey(path).join('-')
}
function reverseKey(path) {
  let keys = []
  while (path) {
    keys.unshift(path.key)
    path = path.prev
  }
  return keys
}

function selectionName(selection) {
  return (selection.alias && selection.alias.value) || selection.name.value
}

function findSelections(keys, operation) {
  keys = keys.filter(i => typeof i === 'string')
  let key = keys.shift()
  let selections = operation.selectionSet.selections
  while (key) {
    selections = selections.find(selection => selectionName(selection) == key).selectionSet.selections
    key = keys.shift()
  }
  return selections
}

function depend(name, mutatesFields) {
  for (let i = 0; i < mutatesFields.length; i++) {
    const field = mutatesFields[i]
    if (selectionName(field) == name) {
      return mutatesFields[i - 1]
    }
  }
  return null
}

function mutateResolver(isMutate, resolver, options) {
  const { mutations } = options
  return (source, args, ctx, info) => {
    if (!ctx.__mutate) ctx.__mutate = {}
    const keyPath = compositeKey(info.path)
    const keys = reverseKey(info.path)
    const name = keys.pop()

    const selections = findSelections(keys.slice(), info.operation)
    const mutatesFields = selections.filter(s => mutations.indexOf(s.name.value) !== -1)
    const dependant = isMutate ? depend(name, mutatesFields) : mutatesFields[mutatesFields.length - 1]

    return new Promise((resolve, reject) => {
      const callback = (source) => {
        Promise.resolve(resolver(source, args, ctx, info)).then(data => {
          if (isMutate) {
            const {source, result} = data
            resolve(result)
            if (ctx.__mutate[keyPath]) {
              ctx.__mutate[keyPath].forEach(r => r(source))
              ctx.__mutate[keyPath] = []
              delete ctx.__mutate[keyPath]
            }
          } else {
            resolve(data)
          }
        })
      }
      if (!dependant) {
        if (isMutate) {
          setTimeout(() => {
            callback(source)
          }, 0)
        } else {
          callback(source)
        }
      } else {
        keys.push(selectionName(dependant))
        const dependantPath = keys.join('-')
        if (!ctx.__mutate[dependantPath]) ctx.__mutate[dependantPath] = []
        ctx.__mutate[dependantPath].push(callback)
      }
    })
  }
}

function mutate(resolvers, options) {
  const { mutations, dependencies } = options
  const dict = {}
  mutations.forEach(key => {
    if (!resolvers[key]) {
      throw Error('Mutate resolvers must be implemented')
    }
    dict[key] = mutateResolver(true, resolvers[key], options)
  })
  dependencies.forEach(key => {
    dict[key] = mutateResolver(false, resolvers[key] || (i => i[key]), options)
  })
  return Object.assign({}, resolvers, dict)
}

module.exports = { mutate }