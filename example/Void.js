const {
  GraphQLScalarType,
} = require('graphql')
module.exports = new GraphQLScalarType({
  name: 'Void',
  description: 'Void custom scalar type',
  parseValue() {
    return null
  },
  serialize() {
    return null
  },
  parseLiteral(ast) {
    return null
  },
})