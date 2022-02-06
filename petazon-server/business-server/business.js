const express = require('express')
const bodyParser = require('body-parser')
const mongoose = require('mongoose')
const session = require('express-session')
const passport = require('passport')
const passportLocalMongoose = require('passport-local-mongoose')
const cookieSession = require('cookie-session')
const cors = require('cors')
const cookieParser = require('cookie-parser');
const multer = require('multer');
const {GridFsStorage} = require('multer-gridfs-storage');
const Grid = require('gridfs-stream');
const methodOverride = require('method-override');

const app = express();

app.use(express.json());
app.use(methodOverride('_method'));
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

let conn = mongoose.createConnection('mongodb+srv://admin-soham:soham@cluster0.rgrzw.mongodb.net/petazonDB', {useNewUrlParser: true, useUnifiedTopology: true});

const businessSchema = new mongoose.Schema({
  username: String,
  password: String,
  revenue: Number,
  products: Array,
  name: String,
  sales: Number
})

businessSchema.plugin(passportLocalMongoose);

const Business = conn.model('Business', businessSchema);

passport.use(Business.createStrategy());

passport.serializeUser(Business.serializeUser());
passport.deserializeUser(Business.deserializeUser());

app.post('/business-register', (req, res) => {
  Business.register({username: req.body.username, name: req.body.name, revenue: 0, active: false}, req.body.password, (err, business) => {
    if (err) {
      console.log(err);
      res.sendStatus(500);
    } else {
      req.login(business, err => {
        if (err) {
          console.log(err);
          return;
        }
        passport.authenticate('local', {}, () => {
          console.log(req.isAuthenticated());
        })(req, res, () => {
          res.redirect('/dashboard');
        })
        res.cookie('business', true);
        res.cookie('id', business._id)
        res.json({business: business})
        console.log(`registered ${business.username} as ${req.isAuthenticated()}`)
      })
    }
  })
})

app.post('/business-login', (req, res) => {
  const business = new Business({
    username: req.body.username,
    password: req.body.username
  });

  req.login(business, err => {
    if (err) {
      console.log(err)
      res.sendStatus(500)
    } else {
      passport.authenticate('local')(req, res, () => {
        Business.find({username: req.body.username}, (err, business) => {
          if (err) {
            console.log(err)
            res.sendStatus(500)
          } else {
            res.cookie('business', true);
            res.cookie('id', business[0]._id)
            res.json({business: business})
          }
        })
      })
    }
  })
})

app.get('/business-authenticated', (req, res) => {
  res.json({authenticated: req.isAuthenticated() && req.cookies['business']})
})

app.post('/business-logout', (req, res) => {
  console.log('logout')
  req.logout();
  res.sendStatus(200);
})



/**
 * Product:
 *  sales: number
 *  price: number
 *  name: number
 *  business_id: id of the business
 *  image: image
 *
 * 2 methods:
 *
 * upload product:
 *  uploads a product with 0 sales, custom price and name, business_id, custom image
 *
 */



// Init gfs
let gfs;

conn.once('open', () => {
  // Init Stream
  gfs = Grid(conn.db, mongoose.mongo);
  gfs.collection('uploads');
})

// Create storage engine
const crypto = require('crypto')
const path = require("path");

const storage = new GridFsStorage({
  url: 'mongodb://localhost:27017/petazonDB',
  file: (req, file) => {
    return new Promise((resolve, reject) => {
      crypto.randomBytes(16, (err, buf) => {
        if (err) {
          return reject(err);
        }
        const filename = buf.toString('hex') + path.extname(file.originalname);
        const fileInfo = {
          filename: filename,
          bucketName: 'uploads'
        };
        resolve(fileInfo);
      })
    })
  }
})
const upload = multer({ storage });

const productSchema = new mongoose.Schema({
  sales: Number,
  price: Number,
  name: String,
  desc: String,
  business_id: String,
  image_name: String,
  category: String
});

const Product = conn.model('Product', productSchema);


/**
 * @route POST /api/upload-product
 * @desc Upload Product
 */
app.post('/api/upload-product', upload.single('file'), (req, res) => {
  let business_id = req.body.business_id;
  business_id = business_id.substring(3,req.body.business_id.length-1)
  console.log(req.body)
  const product = new Product({
    sales: 0,
    price: Number(req.body.price),
    name: req.body.name,
    desc: req.body.desc,
    business_id: business_id,
    image_name: req.file.filename,
    category: req.body.category
  })
  console.log(product);
  product.save();

  Business.findById(business_id, (err, result) => {
    if (err) {
      console.log(err)
    } else {
      if (result) {
        Business.findByIdAndUpdate(result._id, {$set: {products: [...result.products, product._id]}}, {new: true}).then((docs) => {
          if(docs) {
            console.log(docs)
          } else {
            console.log('huh?')
          }
        }).catch((err)=>{
          console.log(err);
        });
      }
    }
  })

  res.sendStatus(200)
})

app.get('/img/:id', (req, res) => {
  gfs.files.findOne({filename: req.params.id}, (err, file) => {
    if (!file || file.length === 0) {
      console.log(file)
      return res.status(404).json({
        err: 'No file exists'
      })
    }

    // Check if image
    if (file.contentType === 'image/jpeg' || file.contentType === 'image/png') {
      // Read output to browser
      const readstream = gfs.createReadStream(file.filename);
      readstream.pipe(res);
    } else {
      console.log(file)
      res.status(404).json({
        err: 'Not an image'
      })
    }
  })
})

app.get('/products', (req, res) => {
  Product.find({}, (err, products) => {
    if (err) {
      console.log(err);
    } else {
      res.json(products)
    }
  })
})

app.get('/categories', (req, res) => {
  Product.find({}, (err, products) => {
    if (err) {
      console.log(err);
    } else {
      let categories = [];
      for (let product of products) {
        categories.push(product.category);
      }

      let categoriesMap = {};
      let categoriesCleaned = [];
      for (let category of categories) {
        if (!categoriesMap[category]) {
          categoriesCleaned.push(category);
          categoriesMap[category] = true;
        }
      }

      res.json(categoriesCleaned);
    }
  })
})

app.get('/products/:category', (req, res) => {
  Product.find({category: req.params.category}, (err, products) => {
    if (err) {
      console.log(err);
    } else {
      res.json(products);
    }
  })
})

mongoose.connect('mongodb+srv://admin-soham:soham@cluster0.rgrzw.mongodb.net/petazonDB')
const User = mongoose.model('User', new mongoose.Schema({username: String, name: String, purchases: Array, password: String, balance: Number, todo: Array}))

app.post('/buy', (req, res) => {
  let user_id = req.body.user_id;
  user_id = user_id.substring(3, user_id.length-1)
  let product_id = req.body.product_id;
  let times = req.body.items;
  User.findById(user_id, (err, data1) => {
    if (err) {
      console.log(err)
    } else {
      Product.findById(product_id, (err, data) => {
        if (err) {
          console.log(err)
        } else {
          console.log(data.sales+1)
          Product.findByIdAndUpdate(product_id, {$set: {sales: data.sales+times}}, {new: true}).then((docs) => {
            if(docs) {
              console.log(docs)
            } else {
              console.log('huh?')
            }
          }).catch((err)=>{
            console.log(err);
          });
          console.log(((data1.balance !== undefined ? data1.balance : 1000) - data.price))
          let product_ids = []
          for (let i = 0; i < times; i++) {
            product_ids[i] = product_id
          }
          User.findByIdAndUpdate(user_id, {$set: {purchases: [...data1.purchases, ...product_ids], balance: ((data1.balance !== undefined && (data1.balance >= data.price * times) ? data1.balance : 1000) - (data.price * times))}}, {new: true}).then((docs) => {
            if(docs) {
              console.log(docs)
            } else {
              console.log('huh?')
            }
          }).catch((err)=>{
            console.log(err);
          });
          Business.findById(data.business_id, (err, result) => {
            if (err) {
              console.log(err);
            } else {
              Business.findByIdAndUpdate(data.business_id, {$set: {revenue: result.revenue + (data.price * times), sales: ((result.sales ? result.sales : 0) + times)}}, {new: true}).then((docs) => {
                if(docs) {
                  console.log(docs)
                } else {
                  console.log('huh?')
                }
              }).catch((err)=>{
                console.log(err);
              });
            }
          })
        }
      })
    }
  })
  res.sendStatus(200)
})


app.get('/sales/:id', (req, res) => {
  let id = req.params.id;
  id = id.substring(3,id.length-1)

  Business.findById(id, (err, result) => {
    if (!err) {
      if (result !== null) {
        res.json({sales: result.sales});
      }
    } else {
      console.log(err);
    }
  })
})

app.get('/revenue/:id', (req, res) => {
  let id = req.params.id;
  id = id.substring(3,id.length-1)

  Business.findById(id, (err, result) => {
    if (err) {
      console.log(err);
      res.sendStatus(500)
    } else {
      res.json({revenue: result?.revenue})
    }
  })
})



app.get('/products/business/:id', (req, res) => {
  let id = req.params.id;
  id = id.substring(3,id.length-1)
  console.log(id);
  Product.find({business_id: id}, (err, result) => {
    if (err) {
      console.log(err);
    } else {
      res.json(result)
    }
  })
})

app.post('/products/delete', (req, res) => {
  let product_id = req.body.product_id;
  let business_id = req.body.business_id;
  business_id = business_id.substring(3, business_id.length-1)

  Product.findByIdAndDelete(product_id, (err, doc) => {
    if (err) {
      console.log(err);
      res.sendStatus(500)
    } else {
      Business.findById(business_id, (err, result) => {
        if (err) {
          console.log(err);
          res.sendStatus(500)
        } else {
          let l = result.products.filter(item => {
            console.log(item._id, product_id)
            console.log(item._id != product_id)
            return item._id != product_id
          })
          console.log(l)
          Business.findByIdAndUpdate(business_id, {$set: {products: l}}, {new: true}).then((docs) => {
              if(docs) {
                console.log(docs)
              } else {
                console.log('huh?')
              }
              }).catch((err)=>{
                console.log(err);
              });
            }
          })
      }
    }, (err, doc) => {
    if (err) {
      console.log(err);
    } else {
      res.sendStatus(200)
    }
  })




})

app.get('/user/data/:id', (req, res) => {
  let user_id = req.params.id;
  user_id = user_id.substring(3, user_id.length-1);


  User.findById(user_id, (err, result) => {
    if (err) {
      console.log(err)
    } else {
      let l = result.purchases.length;
      let balance = result.balance;

      res.json({balance: balance, products_bought: l})
    }
  })
})

app.get('/user/purchases/:id', (req, res) => {
  let user_id = req.params.id;
  user_id = user_id.substring(3, user_id.length-1);

  User.findById(user_id, (err, result) => {
    if (err) {
      console.log(err)
    } else {
      let l = result.purchases;
      let m = {}
      let cleaned = []
      let i = 0;
      for (let item of l) {
        if (m[item] === undefined) {
          cleaned.push({id: item, item: 1})
          m[item] = i;
          i++;
        } else {
          cleaned[m[item]]['item'] = cleaned[m[item]]['item'] + 1;
        }
      }
      console.log(cleaned)
      res.json(cleaned)
    }
  })
})

app.get('/product/:id', (req, res) => {
  Product.findById(req.params.id, (err, result) => {
    if (err) {
      console.log(err)
      res.sendStatus(500)
    } else {
      if (result !== null)
        res.json(result)
      else
        res.json({status: '404'})
    }
  })
})

app.post('/topup', (req, res) => {
  let user_id = req.body.user_id;
  user_id = user_id.substring(3, user_id.length-1)
  let amount = req.body.amount;

  User.findById(user_id, (err, result) => {
    User.findByIdAndUpdate(user_id, {$set: {balance: result.balance + amount}}, {new: true}).then((docs) => {
      if(docs) {
        console.log(docs)
      } else {
        console.log('huh?')
      }
    }).catch((err)=>{
      console.log(err);
    });
  });
})

app.get('/', (req, res) => {
    res.json({hello: 'hello'})
})

app.listen(process.env.PORT || 7000, () => {
  console.log('listening on port 7000')
})
