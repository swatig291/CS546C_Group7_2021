const spaceRoutes = require('./space');
const reviewRoutes = require('./review');
const commentRoutes = require('./comment');
const userRoutes = require('./user');

const constructorMethod = (app) => {

//   app.get('/', (req, res) => {
//     return res.render('landing/landing', {
//         authenticated: req.session.user ? true : false,
//         user: req.session.user,
//         partial: 'landing-script',
//         title: 'Home'
//     });
// });
  app.use("/space", spaceRoutes);
  app.use("/review", reviewRoutes);
  app.use("/comment", commentRoutes);
  app.use("/user", userRoutes);
 
  app.use('*', (req, res) => {
    res.status(404).json({ error: 'Not found' });  
  });
};

module.exports = constructorMethod;