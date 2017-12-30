const Sequelize = require('sequelize')
const db        = {}

const sequelize = 
  new Sequelize('test', 'root', 'root', {
    host: 'localhost',
    port: 8889,
    dialect: 'mysql',
    dialectOptions: {
      charset: 'utf8mb4',
      collate: 'utf8mb4_unicode_ci'
    },
    // pool: { max: 5, min: 0, idle: 10000 },
  })

db.sequelize = sequelize
db.Sequelize = Sequelize

const User = sequelize.define('User', {
  id: { type: Sequelize.INTEGER, primaryKey: true, autoIncrement: true },
  name: Sequelize.STRING,
  username: {
    type: Sequelize.STRING,
    validate: {
      is: { args: /^[a-zA-Z0-9]+$/, msg: 'Username can only contain a-Z and 0-9'},
      notEmpty: { args: true, msg: 'Username must not empty'},
    }
  },
  articlesCount: Sequelize.INTEGER,
})
const Article = sequelize.define('Article', {
  id: { type: Sequelize.INTEGER, primaryKey: true, autoIncrement: true },
  status: { 
    type: Sequelize.ENUM,
    values: ['draft', 'public'],
    defaultValue: 'draft'
  },
  title: Sequelize.STRING,
  content: Sequelize.STRING,
})
const Comment = sequelize.define('Comment', {
  id: { type: Sequelize.INTEGER, primaryKey: true, autoIncrement: true },
  userId: Sequelize.INTEGER,
  message: Sequelize.STRING,
})

User.hasMany(Article)
Article.belongsTo(User)


User.hasMany(Comment)
Article.hasMany(Comment)
Comment.belongsTo(Article)
Comment.belongsTo(User)


function auth(ctx, user, roles) {
  // if (ctx.loginUser.id != this.user)
}

Article.find = function({id}){ return this.findById(id) }
Article.prototype.addComment = function(args) {
  const { loginUser } = this.graphqlContext
  return this.createComment({...args, userId: loginUser.id})
}


db.User = User
db.Article = Article
db.Comment = Comment

sequelize
  .authenticate()
  .then(() => {
    console.log('Database connection succeed.')
    // User.findById(1).then(u => {
    //   console.log('dd')
    // })
  })
  .catch(err => {
    console.error('Database unable to connect:', err)
  })

module.exports = db
