const spaceData = require('./space');

const constructorMethod = (app) => {

//   app.get('/', (req, res) => {
//     return res.render('landing/landing', {
//         authenticated: req.session.user ? true : false,
//         user: req.session.user,
//         partial: 'landing-script',
//         title: 'Home'
//     });
// });
  app.use("/space", spaceData);

 
  app.use('*', (req, res) => {
    res.status(404).json({ error: 'Not found' });  
  });
};

module.exports = constructorMethod;