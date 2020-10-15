const path = require("path")
const express = require("express")
const mongoose = require("mongoose")
const cookieParser = require('cookie-parser')
const bodyParser = require('body-parser')
const csrf = require('csurf')
const dotenv = require("dotenv")
const morgan = require("morgan")
const exphbs = require("express-handlebars")
const passport = require("passport")
const session = require("express-session")
const MongoStore = require("connect-mongo")(session)
const connectDB = require("./config/db")
const { Mongoose } = require("mongoose")


// load config
dotenv.config({ path: './config/config.env' })

// Passport Config
require('./config/passport')(passport) 

connectDB()

const app = express()

// logging
if (process.env.NODE_ENV === "development") {
  app.use(morgan('dev'))
}
// handlebars
app.engine('.hbs', exphbs({ defaultLayout: 'main', extname: '.hbs'}))
app.set('view engine', '.hbs');



// session middleware
app.use(session({
  secret: 'keyboard cat',
  resave: false,
  saveUninitialized: false,
  store: new MongoStore({ mongooseConnection: mongoose.connection }), 
}))

// enable cookies (needed for CSRF)
app.use(cookieParser());

// enable bodyParser (needed to easily access req.body data)
// parse application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: false })) 

// parse application/json
app.use(bodyParser.json())

// csrf protection
// app.use(csrf({ cookie: false }));

// passport middlewar
app.use(passport.initialize())
app.use(passport.session())

// static folder
app.use(express.static(path.join(__dirname, 'public')))

// routes
app.use('/', require('./routes/index'))
app.use('/auth', require('./routes/auth'))

// error handling
app.use(function (err, req, res, next) {
  if (err.code !== 'EBADCSRFTOKEN') return next(err)

  // handle CSRF token errors here
  console.error(`CSRF protection triggered from ${req.baseUrl}`);
  res.status(403);
  res.send('form tampered with');
})

const PORT = process.env.PORT || 3000

app.listen
(PORT, console.log(`Server running in ${process.env.NODE_ENV} mode on port ${PORT}`)) 
