const express = require('express');
const app = express();
const configureRoutes = require('./routes');
// const cookieParser = require('cookie-parser');
const session = require('express-session')

const configRoutes = require('./routes');
const static = express.static(__dirname + '/public');
const exphbs = require('express-handlebars');

// app.use(cookieParser());

app.use(express.urlencoded({ extended: true }));

// app.engine('handlebars', exphbs({ defaultLayout: 'main' }));

  const handlebarsInstance = exphbs.create({
    defaultLayout: 'main',
    // Specify helpers which are only registered on this instance.
    helpers: {
      asJSON: (obj, spacing) => {
        if (typeof spacing === 'number')
          return new Handlebars.SafeString(JSON.stringify(obj, null, spacing));
  
        return new Handlebars.SafeString(JSON.stringify(obj));
      }
    }
  });

 
  app.use;
  app.use('/public', static);
  app.use(express.json());
  app.use(express.urlencoded({ extended: true }));
  // app.use(rewriteUnsupportedBrowserMethods);
  
  app.engine('handlebars', handlebarsInstance.engine);
  app.set('view engine', 'handlebars');

//To initialize sessions for the user
app.use(session({
  name: 'AuthCookie',
  secret: 'some secret string!',
  resave: false,
  saveUninitialized: true
}))
  
app.get('/', (req, res,next) => {
    if (req.session.email) {
       res.redirect('/space');
    } else {
      next();
    }
})

app.get('/user/signup', async(req, res, next) => {
    if(req.session.email) return res.redirect('/space');
    next();
});

app.get('/user/login', async(req, res, next) => {
  if(req.session.email) return res.redirect('/space');
  next();
});

app.get('/user/logout', async(req, res, next) => {
  if(!req.session.email) return res.redirect('/user/login');
  next();
});

app.get('/user/profile', async(req, res, next) => {
  if(!req.session.email) return res.redirect('/user/login');
  next();
})

app.get('/user/profile/firstName', async(req, res, next) => {
  if(!req.session.email) return res.redirect('/user/login');
  next();
})

app.get('/user/profile/lastName', async(req, res, next) => {
  if(!req.session.email) return res.redirect('/user/login');
  next();
})

app.get('/user/profile/email', async(req, res, next) => {
  if(!req.session.email) return res.redirect('/user/login');
  next();
})

app.get('/user/profile/phoneNumber', async(req, res, next) => {
  if(!req.session.email) return res.redirect('/user/login');
  next();
})

// app.get('/private', async(req, res, next) => {
//     if(!req.session.username) return res.status(403).render('Individual/error');
//     next();
// });

// To know the status of the request method, request route and whether the user is authenticated
app.use(async(req, res, next) => {
    let timeStamp = new Date().toUTCString();
    let reqMethod = req.method;
    let reqRoute = req.originalUrl;
    if(req.session.email) console.log(timeStamp + ': ' + reqMethod + reqRoute + ' [Authenticated user]');
    else console.log(timeStamp + ': '+ reqMethod + reqRoute + ' [Non-Authenticated user]');
    next();
});


  configRoutes(app);


  app.listen(3000, () => {
    console.log("We've now got a server!");
    console.log('Your routes will be running on http://localhost:3000');
  });