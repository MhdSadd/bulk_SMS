require("dotenv").config();
const express = require("express");
const app = express();
const logger = require("morgan");
const ejs = require("ejs");
const path = require("path");
const cookieParser = require("cookie-parser");
const bodyParser = require("body-parser");
const session = require("express-session");
const MongoStore = require('connect-mongo')(session);
const flash = require('connect-flash')
const passport = require("passport");
const mongoose = require("mongoose");
const {mongoURI, globalVariables} = require('./config/configurations')
require("./config/passport")(passport);
const credentials = require('./config/configurations').credentials


app.use(logger('dev'))

// connecting to DB
mongoose
  .connect(mongoURI, {
    useCreateIndex: true,
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => {
    console.log(`DB Connected successfully...`);
  })
  .catch((err) => {
    console.log(err);
  });

  // Africa's Talking init
const AT = require("africastalking")(credentials);

  //initialize AT's SMS service
const sms = AT.SMS;

  // set up view engine
app.set("views", path.join(__dirname, "views"));
app.set("view engine", "ejs");


// path init for static file
app.use(express.static(path.join(__dirname, "public")));

// cookie parser init
app.use(cookieParser());

// bodyParser init
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

//configure Express session
app.use(session({
    cookie: {
      maxAge: 180 * 60 * 1000,
    },
    secret: process.env.SESSION_SECRET,
    resave: false,
    saveUninitialized: false,
    cookie: {
      maxAge: 360000, //expire after an hour
    },
    store: new MongoStore({
      mongooseConnection: mongoose.connection,
      ttl: 600 * 6000 // = 1 hour
      })
  })
);

// flash init
app.use(flash())

// globalvariables Init
app.use(globalVariables)

//passport middleware config
app.use(passport.initialize());
app.use(passport.session());

//passport config
// require("./config/passport")(passport);



// Routes Grouping
const defaultRoutes = require('./routes/users')
const adminRoutes = require('./routes/admin')


// routes
app.use('/', defaultRoutes)
app.use('/admin', adminRoutes)




app.listen(process.env.PORT || 4444, (req,res)=>{
  console.log(`server running on port ${process.env.PORT}`)
})