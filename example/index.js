const express = require('express')
const app = express()
const schema = require('./schema')

const graphqlHTTP = require('express-graphql');

app.use('/graphql', graphqlHTTP({
  schema,
  graphiql: true,
}));

app.listen(3000, function () {
	console.info('start server')
	console.info('open http://127.0.0.1:3000/graphql?query=query%20%7B%0A%09user(id%3A%201)%20%7B%0A%09%09update(input%3A%20%7Bname%3A%20%22Justin%22%2C%20username%3A%20%22justin123%22%7D)%0A%09%09name%0A%09%09username%0A%09%09articleCount%0A%09%09addArticle%0A%09%7D%0A%09allUsers%20%7B%0A%09%09name%0A%09%09username%0A%09%7D%0A%7D%0A')
})
