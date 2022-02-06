const express = require('express')
const bodyParser = require('body-parser')
const mongoose = require('mongoose')
const session = require('express-session')
const passport = require('passport')
const passportLocalMongoose = require('passport-local-mongoose')
const cookieSession = require('cookie-session')
const cors = require('cors')
const cookieParser = require('cookie-parser');

const app = express();

app.use(express.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(cookieParser())
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
  origin: "https://petazon.surge.sh",
  methods: ["POST", "PUT", "GET", "OPTIONS", "HEAD"],
  credentials: true
}))

mongoose.connect('mongodb+srv://admin-soham:soham@cluster0.rgrzw.mongodb.net/petazonDB');

const userSchema = new mongoose.Schema({
  username: String,
  password: String,
  name: String,
  purchases: Array,
  balance: Number,
  todo: Array
})

userSchema.plugin(passportLocalMongoose);

const User = new mongoose.model('User', userSchema);

passport.use(User.createStrategy());

passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

app.post('/register', (req, res) => {
  User.register({username: req.body.username, name: req.body.name, balance: 1000, active: false}, req.body.password, (err, user) => {
    if (err) {
      console.log(err)
      res.redirect('/')
    } else {
      req.login(user, (err) => {
        if (err) {
          console.log(err);
          res.sendStatus(500)
        } else {
          passport.authenticate('local', {}, () => {
            console.log(req.isAuthenticated());
          })(req, res, () => {
            res.redirect('/dashboard');
          })
          res.cookie('id', user._id)
          res.json({user: user})
          console.log(`registered ${user.username} as ${req.isAuthenticated()}`)
        }
      })
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
          res.cookie('id', result[0]._id)
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

app.post('/todo-add', (req, res) => {
  let user_id = req.body.user_id;
  user_id = user_id.substring(3, user_id.length-1);
  let title = req.body.title;
  let date = req.body.date;
  let time = req.body.time;
  let type = req.body.type;
  let todo_item;
  if (type === 'recurring') {
    todo_item = {title: title, time: time, type: type}
  } else {
    todo_item = {title: title, time: time, date: date, type: type}
  }

  User.findById(user_id, (err, result) => {
    if (err || result === null) {
      console.log(result)
      console.log(err)
    } else {
      User.findByIdAndUpdate(user_id, {$set: {todo: [...result.todo, todo_item]}}, {new: true}).then((docs) => {
        if(docs) {
          console.log(docs)
          res.json({cool: 'cool'})
        } else {
          console.log('huh?')
        }
      }).catch((err)=>{
        console.log(err);
      });
    }
  })
})

app.post('/delete-todo', (req, res) => {
  let todo_index = req.body.index;
  let user_id = req.body.user_id;
  user_id = user_id.substring(3, user_id.length-1);

  User.findById(user_id, (err, result) => {
    if (err || result === null) {
      console.log(result)
      console.log(err)
    } else {
      console.log(result.todo.filter((vale, index) => index != todo_index))
      User.findByIdAndUpdate(user_id, {$set: {todo: result.todo.filter((vale, index) => index != todo_index)}}, {new: true}).then((docs) => {
        if(docs) {
          console.log(docs)
          res.json({cool: 'cool'})
        } else {
          console.log('huh?')
        }
      }).catch((err)=>{
        console.log(err);
      });
    }
  })
})

app.get('/todo/:id', (req, res) => {
  let user_id = req.params.id;
  user_id = user_id.substring(3, user_id.length-1);

  User.findById(user_id, (err, result) => {
    if (err) {
      console.log(err);
    } else {
      res.json({todo: result.todo})
    }
  })
})


app.listen(process.env.PORT || 5000);
