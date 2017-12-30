const { makeExecutableSchema, buildSchemaFromTypeDefinitions } = require('graphql-tools')
const { parse } = require('graphql')
const GraphQLLanguage = require('graphql/language')
const { mutateDirective, pick, addClass } = require('graphql-mutate')
const typeDefs = require('./typeDefs.graphql')
const { User, Article, Comment } = require('./seq')
const Void = require('./Void')

let resolvers = {
  Query: {
    kk: () => 1,
    User: () => User,
    Article: () => Article,
    Comment: () => Comment,
  },
  Mutation: {
    kk: () => 1,
    User: () => User,
    Article: () => Article,
    Comment: () => Comment,
  },
  User: pick('update', 'createArticle', 'getArticles'),
  UserClass: pick('findById'),
  Article: pick('update', 'addComment', 'getComments'),
  ArticleClass: pick('find'),
  Comment: pick('destroy'),
  CommentClass: pick('find'),
  Void,
}

// resolvers = addClass(resolvers, {
//   User,
//   Article,
//   Comment,
// })

function transformArgs(next, src, inputArgs, args, context) {
  if (args.in) {
    return next(src, { [args.in]: inputArgs })
  } else {
    const keys = Object.keys(inputArgs)
    if (keys.length !== 1) throw new Error('must have only 1 argument in input')
    return next(src, inputArgs[keys[0]])
  }
}

const directiveResolvers = {
  mutate: mutateDirective,
  transformArgs,
}

const typeDefsSchema = classParse(parse(typeDefs))

function findDirective(definition, name) {
  for (let i = 0; i < definition.directives.length; i++) {
    if (definition.directives[i].name.value == name) {
      return definition.directives[i]
    }
  }
  return null
}

function removeDirective(definition, name) {
  let i = 0
  while (i < definition.directives.length) {
    if (definition.directives[i].name.value == name) {
      definition.directives.splice(i, 1)
    } else {
      i++
    }
  }
}

function makeClass(definition) {
  const def = {
    description: undefined,
    directives: [],
    fields: [],
    interfaces: [],
    kind: GraphQLLanguage.Kind.OBJECT_TYPE_DEFINITION,
    name: {
      kind: GraphQLLanguage.Kind.NAME,
      value: definition.name.value + 'Class'
    }
  }
  let i = 0
  while (i < definition.fields.length) {
    const field = definition.fields[i]
    if (findDirective(field, 'static')) {
      removeDirective(field, 'static')
      def.fields.push(field)
      definition.fields.splice(i, 1)
    } else {
      i++
    }
  }
  return def
}

function classParse(schema) {
  const classDefinitions = []
  schema.definitions.forEach(definition => {
    if (definition.kind === GraphQLLanguage.Kind.OBJECT_TYPE_DEFINITION) {
      if (findDirective(definition, 'class')) {
        const kk = makeClass(definition)
        classDefinitions.push(kk)
      }
    }
  })
  schema.definitions.push.apply(schema.definitions, classDefinitions)

  schema.definitions.forEach(definition => {
    if (definition.kind === GraphQLLanguage.Kind.OBJECT_TYPE_DEFINITION
        && (definition.name.value === 'Query' || definition.name.value === 'Mutation')) {
      classDefinitions.forEach(c => {
        definition.fields.push({
          arguments: [],
          description: undefined,
          directives: [],
          kind: GraphQLLanguage.Kind.FIELD_DEFINITION,
          name: {
            kind: GraphQLLanguage.Kind.NAME,
            value: c.name.value.substr(0, c.name.value.length - 5)
          },
          type: {
            kind: GraphQLLanguage.Kind.NAMED_TYPE,
            name: {
              kind: GraphQLLanguage.Kind.NAME,
              value: c.name.value,
            },
          },
        })
      })
    }
  })

  return schema
}


const schema = makeExecutableSchema({
  typeDefs: typeDefsSchema,
  resolvers,
  directiveResolvers,
})

module.exports = schema