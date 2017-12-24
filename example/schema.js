const { makeExecutableSchema } = require('graphql-tools')
const { mutate } = require('graphql-mutate')
const { allUsers, findUser } = require('./DB')
const User = require('./User')

const resolvers = {
	Query: {
    user: (_, {id}) => {
			return findUser(id)
    },
    allUsers: () => {
			return allUsers()
    },
  },
  Mutation: {
    useless: () => 1,
  },
  User: mutate(User, {
    mutations: ['update', 'addArticle'],
    dependencies: ['name', 'articleCount'],
  })
}

const typeDefs = `
input UserInput {
  name: String
  username: String
}

type User {
	name: String
  username: String
  articleCount: Int
  update(input: UserInput): String
  addArticle: String
}

type Query {
  user(id: Int): User
  allUsers: [User]
}

type Mutation {
  useless: Int
}

schema {
  query: Query
  mutation: Mutation
}
`

const schema = makeExecutableSchema({
	typeDefs,
	resolvers,
})

module.exports = schema