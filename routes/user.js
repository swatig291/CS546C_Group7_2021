const express = require('express');
const router = express.Router();
const data = require('../data');
const userData = data.users;

router.get('/login', async (req, res) => {
    try{
        res.render('users/login', {pageTitle: 'loginPage'});
    }catch(e){
        
    }
})

router.post('/login', async (req, res) => {
    try{
        //destructuring request body details into username and password
        let cred = req.body;
        const {email, password} = cred
        
        let authentication = await userData.checkUser(email, password);
        if(authentication !== null) {
            req.session.email = email;
            req.session._id = authentication._id.toString();
            res.redirect('/');
        }
        else res.status(500).render('users/login', {pageTitle: 'error occured', hasError: true, error: 'Internal Server Error', isAuthenticated: false});
    }catch(e){
        res.status(400).render('users/login', {pageTitle: 'error occured', hasError: true, error: e, isAuthenticated: false});
    }
})

router.get('/signup', async (req, res) => {
    try{
        res.render('users/signup', {pageTitle: 'signupPage'});
    }catch(e){
        
    }
})

router.post('/signup', async (req, res) => {
    try{
        //destructuring request body details into username and password
        let cred = req.body;
        const {firstName, lastName, email, password, phoneNumber, ssn} = cred
        
        let authentication = await userData.createUser(firstName, lastName, email, password, phoneNumber, ssn);
        if(authentication.userInserted == true) {
            res.redirect('/login');
        }
        else res.status(500).render('users/signup', {pageTitle: 'error occured', hasError: true, error: 'Internal Server Error', isAuthenticated: false});
    }catch(e){
        res.status(400).render('users/signup', {pageTitle: 'error occured', hasError: true, error: e, isAuthenticated: false});
    }
})

router.get('/profile', async (req, res) => {
    try{
        let userDetails = await userData.getUser(req.session._id);
        res.render('users/profile', {
            pageTitle: 'Profile Page',
            firstName: userDetails.firstName,
            lastName: userDetails.lastName,
            email: userDetails.email,
            ssn: userDetails.ssn,
            password: userDetails.password,
            phoneNumber: userDetails.phoneNumber
        });
    }catch(e){
        
    }
})

router.post('/profile/firstName', async (req, res) => {
    try{
        //destructuring request body details into username and password
        let cred = req.body;
        const {firstName} = cred;
        
        let authentication = await userData.updateUserFirstName(req.session._id, firstName);
        if(authentication.userFirstNameModified == true) {
            res.render('users/profile', {userFirstNameModified: true});
        }
        else res.status(500).render('users/profile', {pageTitle: 'error occured', hasError: true, error: 'Internal Server Error', isAuthenticated: false});
    }catch(e){
        res.status(400).render('users/profile', {pageTitle: 'error occured', hasError: true, error: e, isAuthenticated: false});
    }
})

router.post('/profile/lastName', async (req, res) => {
    try{
        //destructuring request body details into username and password
        let cred = req.body;
        const {lastName} = cred;
        
        let authentication = await userData.updateUserLastName(req.session._id, lastName);
        if(authentication.userLastNameModified == true) {
            res.render('users/profile', {userLastNameModified: true});
        }
        else res.status(500).render('users/profile', {pageTitle: 'error occured', hasError: true, error: 'Internal Server Error', isAuthenticated: false});
    }catch(e){
        res.status(400).render('users/profile', {pageTitle: 'error occured', hasError: true, error: e, isAuthenticated: false});
    }
})

router.post('/profile/email', async (req, res) => {
    try{
        //destructuring request body details into username and password
        let cred = req.body;
        const {email} = cred;
        
        let authentication = await userData.updateUserEmail(req.session._id, email);
        if(authentication.userEmailModified == true) {
            req.session.email = email;
            res.render('users/profile', {userEmailModified: true});
        }
        else res.status(500).render('users/profile', {pageTitle: 'error occured', hasError: true, error: 'Internal Server Error', isAuthenticated: false});
    }catch(e){
        res.status(400).render('users/profile', {pageTitle: 'error occured', hasError: true, error: e, isAuthenticated: false});
    }
})

router.post('/profile/phoneNumber', async (req, res) => {
    try{
        //destructuring request body details into username and password
        let cred = req.body;
        const {phoneNumber} = cred;
        
        let authentication = await userData.updateUserPhoneNumber(req.session._id, phoneNumber);
        if(authentication.userPhoneNumberModified == true) {
            res.render('users/profile', {userPhoneNumberModified: true});
        }
        else res.status(500).render('users/profile', {pageTitle: 'error occured', hasError: true, error: 'Internal Server Error', isAuthenticated: false});
    }catch(e){
        res.status(400).render('users/profile', {pageTitle: 'error occured', hasError: true, error: e, isAuthenticated: false});
    }
})

module.exports = router;