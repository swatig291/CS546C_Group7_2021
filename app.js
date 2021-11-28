const express = require('express');
const app = express();
const configureRoutes = require('./routes');
// const cookieParser = require('cookie-parser');
// const session = require('express-session')
const static = express.static(__dirname + '/public');
const exphbs = require('express-handlebars');

// app.use(cookieParser());

app.use(express.json());

// app.use(session({
//   name: 'AuthCookie',
//   secret: 'some secret string!',
//   resave: false,
//   saveUninitialized: true
// }))
//Console log data for every request.
// app.use(async (req, res, next) => {
//  let currentTimeStamp = new Date().toUTCString();
//  let RequestMethod = req.method;
//  let RequestRoute = req.originalUrl;
//  let authStatus = 'Non-Authenticated User';
//  if(req.session.user)
//  {
//    authStatus = 'Authenticated User'
//  }
//   console.log(currentTimeStamp + ': '+ RequestMethod + RequestRoute +'('+ authStatus + ')');
//   next();
//   return;
// });

//   app.use('/private', (req, res, next) => {   
//     if (req.session.user) {
//       next();
//     } else {
//       return res.redirect('/error');
//     }
//   });
//   app.get('/', (req, res,next) => {
// 		if (req.session.user) {
// 			res.redirect('/private');
// 		} else {
//       next();
// 		}
// 	})
 
//     app.use('/signup', (req, res, next) => {   
//       if (req.session.user) {
//         return res.redirect('/private');
//       } else {
//         next();
//       }
//     });
   

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

  configureRoutes(app);


  app.listen(3000, () => {
    console.log("We've now got a server!");
    console.log('Your routes will be running on http://localhost:3000');
  });