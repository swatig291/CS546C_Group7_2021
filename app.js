const express = require('express');
const app = express();
const configureRoutes = require('./routes');
// const cookieParser = require('cookie-parser');
// const session = require('express-session')

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

  configureRoutes(app);


  app.listen(3000, () => {
    console.log("We've now got a server!");
    console.log('Your routes will be running on http://localhost:3000');
  });