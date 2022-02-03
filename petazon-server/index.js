const express = require('express')
const bodyParser = require('body-parser')
const mongoose = require('mongoose')
const session = require('express-session')
const passport = require('passport')
const passportLocalMongoose = require('passport-local-mongoose')
const cookieSession = require('cookie-session')
const cors = require('cors')

const app = express();

app.use(express.json())
app.use(bodyParser.urlencoded({ extended: true }));
app.use(session({
  name: 'session',
  secret: 'mylittlesecret',
  saveUninitialized: false,
  resave: false,
  cookie: {
    sameSite: false,
    secure: process.env.NODE_ENV === "production",
    maxAge: 2 * 60 * 60 * 1000,
    httpOnly: true,
  },
}));
app.use(passport.initialize());
app.use(passport.session());
app.use(cors({
  origin: "http://localhost:4200",
  methods: ["POST", "PUT", "GET", "OPTIONS", "HEAD"],
  credentials: true
}))

mongoose.connect('mongodb://localhost:27017/petazonDB');

const userSchema = new mongoose.Schema({
  username: String,
  password: String
})

userSchema.plugin(passportLocalMongoose);

const User = new mongoose.model('User', userSchema);

passport.use(User.createStrategy());

passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

app.post('/register', (req, res) => {
  User.register({username: req.body.username, active: false}, req.body.password, (err, user) => {
    if (err) {
      console.log(err)
      res.redirect('/')
    } else {
      passport.authenticate('local', {}, () => {
          console.log(req.isAuthenticated());
      })(req, res, () => {
        res.redirect('/dashboard');
      })
      res.json({user: user})
      console.log(`registered ${user.username} as ${req.isAuthenticated()}`)
    }
  })
})

app.post('/login', (req, res) => {
  const user = new User({
    username: req.body.username,
    password: req.body.password
  })

  req.login(user, (err) => {
    if (err) {
      console.log(err)
      res.redirect('/')
    } else {
      passport.authenticate('local')(req, res, () => {
        User.find({username: user.username}, (err, result) => {
          let auth = req.isAuthenticated();
          res.json({user: result[0], auth: auth})
        })
      })

    }
  })
})

app.get('/is-authenticated', (req, res) => {
  console.log(req.isAuthenticated())

  res.json({auth: req.isAuthenticated()})
})

app.post('/logout', (req, res) => {
  req.logout();
  res.sendStatus(200);
})

app.listen(5000);
