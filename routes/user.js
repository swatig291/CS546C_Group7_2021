const express = require('express');
const router = express.Router();
const data = require('../data');
const userData = data.users;
const spaceData = data.space;
const commentData = data.comments;
const reviewData = data.reviews;
const bookingData = data.bookings;
const path = require("path");
const fs = require('fs');

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
            req.session.userId = authentication._id.toString();
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
            res.redirect('/user/login');
        }
        else res.status(500).render('users/signup', {pageTitle: 'error occured', hasError: true, error: 'Internal Server Error', isAuthenticated: false});
    }catch(e){
        res.status(400).render('users/signup', {pageTitle: 'error occured', hasError: true, error: e, isAuthenticated: false});
    }
})

router.get('/logout', async (req, res) => {
    try{
        req.session.destroy();
        res.render('users/logout', {pageTitle: 'logoutPage'});
    }catch(e){
        res.status(500).render('users/logout', {pageTitle: 'error occured', hasError: true, error: 'Internal Server Error', isAuthenticated: false});
    }
})

router.get('/delete', async (req, res) => {
    try{
        let accountDelete = await userData.deleteUser(req.session.userId);
        if(accountDelete.userDeleted == true) {
            req.session.destroy();
            res.json('account deleted');
        }
        else res.status(500).json('server error');
        
    }catch(e){
        res.json(e);
    }
})

router.get('/profile', async (req, res) => {
    try{
        let userDetails = await userData.getUser(req.session.userId);
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
        
        let authentication = await userData.updateUserFirstName(req.session.userId, firstName);
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
        
        let authentication = await userData.updateUserLastName(req.session.userId, lastName);
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
        
        let authentication = await userData.updateUserEmail(req.session.userId, email);
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
        
        let authentication = await userData.updateUserPhoneNumber(req.session.userId, phoneNumber);
        if(authentication.userPhoneNumberModified == true) {
            res.render('users/profile', {userPhoneNumberModified: true});
        }
        else res.status(500).render('users/profile', {pageTitle: 'error occured', hasError: true, error: 'Internal Server Error', isAuthenticated: false});
    }catch(e){
        res.status(400).render('users/profile', {pageTitle: 'error occured', hasError: true, error: e, isAuthenticated: false});
    }
})

router.post('/profile/password', async (req, res) => {
    try{
        let cred = req.body;
        const {oldPassword, newPassword} = cred;
        
        let authentication = await userData.updateUserPassword(req.session.userId, oldPassword, newPassword);
        if(authentication.userPasswordModified == true) {
            res.json(true);
        }
    }catch(e){
        res.json(false);
    }
})

router.get('/savedSpaces', async (req, res) => {
    try{
        let savedStorage = await userData.getSavedSpaces(req.session.userId);
        console.log(savedStorage);
        if(savedStorage.length == 0) {
            res.json('There are no saved spaces');
        }else{
            let savedSpaces = [];

            for(let i = 0 ; i < savedStorage.length ; i++){
                if(savedStorage[i] == null) throw 'The space id is invalid';
                let spaceDetails = await spaceData.getSpaceById(savedStorage[i]);
                savedSpaces.push(spaceDetails);
            }
            console.log(savedSpaces);
            savedSpaces.forEach(space => {
                let folder  = path.join(__dirname, '../','public/','images/','uploads/',space._id);
                space['photoArray'] = [];
                if (fs.existsSync(folder)) {
                  fs.readdirSync(folder).forEach(file => {
                    let imgPath = 'http://localhost:3000/public/images/uploads/' + space._id + '/'+ file;
                    space.photoArray.push(imgPath);
                   });
                 } 
            })
            console.log(savedSpaces);
            res.render('users/savedSpaces', { savedSpaces });
        }
    }catch(e){
        res.json(e);
    }
});

module.exports = router;