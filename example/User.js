const { updateUser, userAddArticle } = require('./DB')

module.exports = {
  update: (source, {input}) => {
    const newSource = updateUser(source, input)
    return {source: newSource, result: 'Success'}
  },
  addArticle: (source) => {
    const newSource = userAddArticle(source)
    return {source: newSource, result: 'Success'}
  },
}