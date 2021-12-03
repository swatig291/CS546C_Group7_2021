const express = require('express');
const router = express.Router();
const data = require('../data');
const userData = data.users;

router.get('/', async (req, res) => {
    try{
        res.render('users/login', {pageTitle: 'loginPage'});
    }catch(e){
        
    }
})

router.post('/', async (req, res) => {
    try{
        //destructuring request body details into username and password
        let cred = req.body;
        const {email, password} = cred
        
        let authentication = await userData.checkUser(email, password);
        if(authentication !== null) {
            req.session.email = email;
            req.session.userId = authentication._id.toString();
            res.redirect('/');
        }
        else res.status(500).render('users/login', {pageTitle: 'error occured', hasError: true, error: 'Internal Server Error', isAuthenticated: false});
    }catch(e){
        res.status(400).render('users/login', {pageTitle: 'error occured', hasError: true, error: e, isAuthenticated: false});
    }
})

module.exports = router;