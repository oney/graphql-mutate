const { updateUser, userAddArticle } = require('./DB')

module.exports = {
  update: (source, {input}, _, info) => {
    const newSource = updateUser(source, input)
    return new Promise((resolve) => {

      // throw Error('sss')
      info.mutateSource = newSource
      return resolve('Success')
    })
  },
  addArticle: (source, _, __, info) => {
    const newSource = userAddArticle(source)
    info.mutateSource = newSource
    return 'Success'
  },
}