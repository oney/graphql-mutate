class User {
  constructor(args) {
    Object.keys(args).forEach(key => (this[key] = args[key]))
  }
  static find({id}) {
    return findUser(id)
  }
  static all() {
    return allUsers()
  }
  updateMutate({input}, info) {
    const newSource = updateUser(this, input)
    return new Promise((resolve) => {

      // throw Error('sss')
      info.mutateSource = newSource
      return resolve('Success')
    })
  }
  addArticle({input}) {
    userAddArticle(this)
    return 'Success'
  }
}

// const UserResolver = {
//   update(source, args, ctx, info) {
//     source.mutateContext = ctx
//     return source.update(args, info)
//   },
//   addArticle: (source, args) => source.update(args),
// }

// const UserClassResolver = {
//   find(root, args, ctx, info) {
//     User.mutateContext = ctx
//     return User.find(args, info)
//   },
//   all(root, args, ctx, info) {
//     User.mutateContext = ctx
//     return User.all(args, info)
//   },
// }

const Users = {
  1: new User({id: 1, name: 'Howard', username: 'howard123', articleCount: 10}),
  2: new User({id: 2, name: 'Alex', username: 'alex123', articleCount: 20}),
  3: new User({id: 3, name: 'Kevin', username: 'kevin123', articleCount: 30}),
}

function allUsers() {
  return Object.keys(Users).map(k => Users[k])
}

function findUser(id) {
  return Users[id]
}

function updateUser(user, params) {
  const newUser = new User(Object.assign({}, Users[user.id], params))
  Users[user.id] = newUser
  return newUser
}

function userAddArticle(user) {
  user.articleCount++
}

module.exports = User