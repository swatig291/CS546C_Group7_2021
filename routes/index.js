
const spaceData = require('./space');
const userRoute = require('./user');
//const loginRoute = require('./userLogin');
const commentData = require('./comments');
const reviewData = require('./reviews');
const bookingData = require('./bookings');
const data = require('../data');
const space = data.space;
const constructorMethod = (app) => {
  
  app.get('/', (req, res) => {
    res.redirect('http://localhost:3000/space');
  });
  
  app.get('/about', (req, res) => {
    res.render('home/about');
  });
  app.use('/user', userRoute);
  app.use('/space', spaceData);
  app.use("/comments", commentData);
  app.use("/reviews", reviewData);
  app.use("/bookings", bookingData);
  app.use('*', (req, res) => {
    res.status(404).render('users/error', { hasError: true, error: 'Page Not Found' });  
  });
};

module.exports = constructorMethod;