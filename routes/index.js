
const spaceData = require('./space');
const signUpRoute = require('./userSignup');
const loginRoute = require('./userLogin');

const data = require('../data');
const space = data.space;
const constructorMethod = (app) => {
  
  app.get('/', (req, res) => {
    res.redirect('http://localhost:3000/space');
  });

  app.use('/signup', signUpRoute);
  app.use('/login', loginRoute);
  app.use("/space", spaceData);

 
  app.use('*', (req, res) => {
    res.status(404).json({ error: 'Not found' });  
  });
};

module.exports = constructorMethod;