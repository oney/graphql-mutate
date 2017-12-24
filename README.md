# graphql-mutate

Make GraphQL support nested mutations

## Goal

Schema
```graphql
type User {
  id: ID
  name: String
  articleCount: Int
  team: Team
  update(input: UserInput): String
  addArticle(input: ArticleInput): Article
}
```
`update` and `addArticle` is mutation in type `User`

```graphql
query {
  user(id: 1) {
    id
    name
    articleCount
    team
    update(input: { name: "Justin" })
    addArticle(input: { title: "Hello"}) {
      title
    }
  }
}
```
We hope it first executes `update` and then `addArticle` sequentially.  
After executing mutations, it will evaluate `name` and `articleCount` in parallel because `update` and `addArticle` may change value of `name` or `articleCount`.  
But it can still evaluate `id` and `team` immediately before executing mutations because they won't change by mutations.

## How
Use `graphql-mutate`!

```shell
npm install graphql-mutate
```

```js
const { mutate } = require('graphql-mutate')
const { makeExecutableSchema } = require('graphql-tools')

const User = require('./User') // User type resolvers

const resolvers = {
  Query: {},
  Mutation: {},
  User: mutate(User, {
    mutations: ['update', 'addArticle'],
    dependencies: ['name', 'articleCount'],
  })
}

const schema = makeExecutableSchema({
  typeDefs,
  resolvers,
})
```
`const User = require('./User')` is normal type resolver, and you just wrap it with `mutate`.  
* `mutations` option: a array includes all mutation field names
* `dependencies` option: a array includes all field names that may be affected by mutations

## TODO
[ ] Testing


## License

graphql-mutate is available under the MIT license.