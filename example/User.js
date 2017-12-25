const { updateUser, userAddArticle } = require('./DB')

module.exports = {
  update: (source, {input}) => {
    const newSource = updateUser(source, input)
    return new Promise((resolve) => {

      // throw Error('sss')
      return resolve({source: newSource, result: 'Success'})
    })
  },
  addArticle: (source) => {
    const newSource = userAddArticle(source)
    return {source: newSource, result: 'Success'}
  },
}