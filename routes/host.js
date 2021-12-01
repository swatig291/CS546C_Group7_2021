const express = require('express');
const router = express.Router();
const data = require('../data');
const spaceData = data.space;

router.get('/', async (req, res) => {
    try{
        res.render('users/signup', {pageTitle: 'signupPage'});
    }catch(e){
        
    }
})

router.post('/', async (req, res) => {
    try{
        //destructuring request body details into username and password
        let cred = req.body;
        const {firstName, lastName, email, password, phoneNumber, ssn} = cred
        
        let authentication = await userData.createUser(firstName, lastName, email, password, phoneNumber, ssn);
        if(authentication.userInserted == true) {
            res.redirect('/space');
        }
        else res.status(500).render('users/signup', {pageTitle: 'error occured', hasError: true, error: 'Internal Server Error', isAuthenticated: false});
    }catch(e){
        res.status(400).render('users/signup', {pageTitle: 'error occured', hasError: true, error: e, isAuthenticated: false});
    }
})

module.exports = router;