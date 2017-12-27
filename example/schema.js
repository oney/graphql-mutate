const { makeExecutableSchema } = require('graphql-tools')
const { mutate, mutateDirective, pickInstance, pickClass, pick } = require('graphql-mutate')
// const User = require('./User')
const { User, Article, Comment } = require('./seq')
const Void = require('./Void')
// const pick = require('lodash.pick')

const resolvers = {
  Query: {
    User: () => User,
    Article: () => Article,
    Comment: () => Comment,
  },
  Mutation: {
    User: () => User,
    Article: () => Article,
    Comment: () => Comment,
  },
  User: pick('update', 'createArticle', 'articles'),
  UserClass: pick('find'),
  Article: pick('update', 'addComment', 'getComments'),
  ArticleClass: pick('find'),
  Comment: pick('destroy'),
  CommentClass: pick('find'),
  Void,
}

const directiveResolvers = {
  mutate: mutateDirective,
}

const typeDefs = `

directive @mutate(depend: Boolean) on FIELD_DEFINITION

scalar Void

enum ArticlesStatus {
  draft
  public
}

type User {
  name: String
  username: String @mutate(depend: true)
  articlesCount: Int @mutate(depend: true)
  update(name: String, username: String): Void @mutate
  createArticle(title: String, content: String): Article @mutate
  articles(status: ArticlesStatus = public): [Article]
}

type UserClass {
  all: [User] @mutate(depend: true)
  find(id: Int): User
  create(name: String, username: String): User @mutate
}

type Article {
  title: String
  content: String @mutate(depend: true)
  update(content: String): Void @mutate
  addComment(message: String): Comment @mutate
  getComments: [Comment] @mutate(depend: true)
}

type ArticleClass {
  featured: [Article]
  find(id: Int): Article
}

type Comment {
  id: Int
  message: String
  update(content: String): Void @mutate
  destroy: Void @mutate
}

type CommentClass {
  find(id: Int): Comment
}

type Query {
  User: UserClass
  Article: ArticleClass
  Comment: CommentClass
}

type Mutation {
  User: UserClass
  Article: ArticleClass
  Comment: CommentClass
}

schema {
  query: Query
  mutation: Mutation
}
`

const schema = makeExecutableSchema({
  typeDefs,
  resolvers,
  directiveResolvers,
})

module.exports = schema