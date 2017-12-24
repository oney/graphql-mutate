const Users = {
  1: {id: 1, name: 'Howard', username: 'howard123', articleCount: 10},
  2: {id: 2, name: 'Alex', username: 'alex123', articleCount: 20},
  3: {id: 3, name: 'Kevin', username: 'kevin123', articleCount: 30},
}

function allUsers() {
  return Object.keys(Users).map(k => Users[k])
}

function findUser(id) {
  return Users[id]
}

function updateUser(user, params) {
  const newUser = Object.assign({}, Users[user.id], params)
  Users[user.id] = newUser
  return newUser
}

function userAddArticle(user) {
  const newUser = Object.assign({}, Users[user.id], {articleCount: Users[user.id].articleCount + 1})
  Users[user.id] = newUser
  return newUser
}

module.exports = {
  allUsers,
  findUser,
  updateUser,
  userAddArticle,
}