const express = require('express');
const router = express.Router();
const data = require('../data');
const userData = data.users;
const spaceData = data.space;
const verify = require('../data/util');
const path = require("path");
const fs = require('fs');
const xss = require('xss');

router.get('/login', async (req, res) => {
    try{
        res.render('users/login', {pageTitle: 'loginPage'});
    }catch(e){
        
    }
})

router.post('/login', async (req, res) => {
    try{
        let cred = req.body;
        const email = xss(cred.email);
        const password = xss(cred.password);
        
        if(!verify.validEmail(email)) throw 'Email is invalid.';
        if(password.trim().length<6 || password.indexOf(' ')>=0) throw 'The password is invalid';

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

        let firstName = xss(req.body.firstName);
        let lastName = xss(req.body.lastName);
        let email = xss(req.body.email);
        let password = xss(req.body.password);
        let phoneNumber = xss(req.body.phoneNumber);
        let ssn = xss(req.body.ssn);

        if(!verify.validString(firstName)) throw 'First Name must be a valid string.';
        if(!verify.validString(lastName)) throw 'Last Name must be a valid string.';
        if(!verify.validEmail(email)) throw 'Email is invalid.';
        if(password.trim().length<6 || password.indexOf(' ')>=0) throw 'The password is invalid';
        if(!verify.validNumber(phoneNumber)) throw 'The Phone Number is invalid';
        if(phoneNumber.length != 10) throw 'The Phone Number is invalid';
        if(!verify.validNumber(ssn)) throw 'The SSN is invalid';
        if(ssn.length != 9) throw 'The SSN is invalid';

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
    if(!req.session.email){
        res.status(400).redirect('/user/login');
        return;
    }
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
    if(!req.session.email){
        res.status(400).redirect('/user/login');
        return;
    }
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
    if(!req.session.email){
        res.status(400).redirect('/user/login');
        return;
    }
    try{
        let firstName = xss(req.body.firstName);
        
        if(!verify.validString(firstName)) throw 'First Name must be a valid string.';
        
        let authentication = await userData.updateUserFirstName(req.session.userId, firstName);
        if(authentication.userFirstNameModified == true) {
            let userDetails = await userData.getUser(req.session.userId);
            res.render('users/profile', {
            pageTitle: 'First Name updated successfully', 
            userFirstNameModified: true,
            firstName: userDetails.firstName,
            lastName: userDetails.lastName,
            email: userDetails.email,
            phoneNumber: userDetails.phoneNumber
        });
        }
        else res.status(500).render('users/profile', {pageTitle: 'error occured', hasError: true, error: 'Internal Server Error', isAuthenticated: false});
    }catch(e){
        let userDetails = await userData.getUser(req.session.userId);
        res.status(400).render('users/profile', {
            pageTitle: 'error occured', 
            hasErrorFirstName: true, 
            error: e,
            firstName: userDetails.firstName,
            lastName: userDetails.lastName,
            email: userDetails.email,
            phoneNumber: userDetails.phoneNumber
        });
    }
})

router.post('/profile/lastName', async (req, res) => {
    if(!req.session.email){
        res.status(400).redirect('/user/login');
        return;
    }
    try{
        let lastName = xss(req.body.lastName);

        if(!verify.validString(lastName)) throw 'Last Name must be a valid string.';
        
        let authentication = await userData.updateUserLastName(req.session.userId, lastName);
        if(authentication.userLastNameModified == true) {
            let userDetails = await userData.getUser(req.session.userId);
            res.render('users/profile', {
            pageTitle: 'Last Name updated successfully', 
            userLastNameModified: true,
            firstName: userDetails.firstName,
            lastName: userDetails.lastName,
            email: userDetails.email,
            phoneNumber: userDetails.phoneNumber
            });
        }
        else res.status(500).render('users/profile', {pageTitle: 'error occured', hasError: true, error: 'Internal Server Error', isAuthenticated: false});
    }catch(e){
        let userDetails = await userData.getUser(req.session.userId);
        res.status(400).render('users/profile', {
            pageTitle: 'error occured', 
            hasErrorLastName: true, 
            error: e,
            firstName: userDetails.firstName,
            lastName: userDetails.lastName,
            email: userDetails.email,
            phoneNumber: userDetails.phoneNumber
        });
    }
})

router.post('/profile/email', async (req, res) => {
    if(!req.session.email){
        res.status(400).redirect('/user/login');
        return;
    }
    try{
        let email = xss(req.body.email);

        if(!verify.validEmail(email)) throw 'Email is invalid.';
        
        let authentication = await userData.updateUserEmail(req.session.userId, email);
        if(authentication.userEmailModified == true) {
            req.session.email = email;
            let userDetails = await userData.getUser(req.session.userId);
            res.render('users/profile', {
            pageTitle: 'Email updated successfully', 
            userEmailModified: true,
            firstName: userDetails.firstName,
            lastName: userDetails.lastName,
            email: userDetails.email,
            phoneNumber: userDetails.phoneNumber
            });
        }
        else res.status(500).render('users/profile', {pageTitle: 'error occured', hasError: true, error: 'Internal Server Error', isAuthenticated: false});
    }catch(e){
        let userDetails = await userData.getUser(req.session.userId);
        res.status(400).render('users/profile', {
            pageTitle: 'error occured', 
            hasErrorEmail: true, 
            error: e,
            firstName: userDetails.firstName,
            lastName: userDetails.lastName,
            email: userDetails.email,
            phoneNumber: userDetails.phoneNumber
        });
    }
})

router.post('/profile/phoneNumber', async (req, res) => {
    if(!req.session.email){
        res.status(400).redirect('/user/login');
        return;
    }
    try{
        let phoneNumber = xss(req.body.phoneNumber);

        if(!verify.validNumber(phoneNumber)) throw 'The Phone Number is invalid';
        if(phoneNumber.length != 10) throw 'The Phone Number is invalid';
        
        let authentication = await userData.updateUserPhoneNumber(req.session.userId, phoneNumber);
        if(authentication.userPhoneNumberModified == true) {
            let userDetails = await userData.getUser(req.session.userId);
            res.render('users/profile', {
            pageTitle: 'Phone Number updated successfully', 
            userPhoneNumberModified: true,
            firstName: userDetails.firstName,
            lastName: userDetails.lastName,
            email: userDetails.email,
            phoneNumber: userDetails.phoneNumber
            });
        }
        else res.status(500).render('users/profile', {pageTitle: 'error occured', hasError: true, error: 'Internal Server Error', isAuthenticated: false});
    }catch(e){
        let userDetails = await userData.getUser(req.session.userId);
        res.status(400).render('users/profile', {
            pageTitle: 'error occured', 
            hasErrorPhoneNumber: true, 
            error: e,
            firstName: userDetails.firstName,
            lastName: userDetails.lastName,
            email: userDetails.email,
            phoneNumber: userDetails.phoneNumber
        });
    }
})

router.post('/profile/password', async (req, res) => {
    if(!req.session.email){
        res.status(400).redirect('/user/login');
        return;
    }
    try{
        let oldPassword = xss(req.body.oldPassword);
        let newPassword = xss(req.body.newPassword);

        if(oldPassword.trim().length<6 || oldPassword.indexOf(' ')>=0) throw 'The password is invalid';
        if(newPassword.trim().length<6 || newPassword.indexOf(' ')>=0) throw 'The password is invalid';
        
        let authentication = await userData.updateUserPassword(req.session.userId, oldPassword, newPassword);
        if(authentication.userPasswordModified == true) {
            let userDetails = await userData.getUser(req.session.userId);
            res.render('users/profile', {
                pageTitle: 'Password updated successfully', 
                userPasswordModified: true,
                firstName: userDetails.firstName,
                lastName: userDetails.lastName,
                email: userDetails.email,
                phoneNumber: userDetails.phoneNumber
            });
        }
    }catch(e){
        let userDetails = await userData.getUser(req.session.userId);
        res.status(400).render('users/profile', {
            pageTitle: 'error occured', 
            hasErrorPassword: true, 
            error: e,
            firstName: userDetails.firstName,
            lastName: userDetails.lastName,
            email: userDetails.email,
            phoneNumber: userDetails.phoneNumber
        });
    }
})

router.get('/savedSpaces', async (req, res) => {
    if(!req.session.email){
        res.status(400).redirect('/user/login');
        return;
    }
    try{

        let savedStorage = await userData.getSavedSpaces(req.session.userId);
        
        if(savedStorage.length == 0) {
            throw 'There are no saved spaces';
        }else{
            let savedSpaces = [];

            for(let i = 0 ; i < savedStorage.length ; i++){
                if(savedStorage[i] == null) throw 'The space id is invalid';
                let spaceDetails = await spaceData.getSpaceById(savedStorage[i]);
                savedSpaces.push(spaceDetails);
            }
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
            res.render('users/savedSpaces', { savedSpaces });
        }
    }catch(e){
        res.status(400).render('users/error', {hasError: true, error: e});
    }
});

router.post('/savedSpaces/:id', async (req, res) => {
    if(!req.session.email){
        res.status(400).redirect('/user/login');
        return;
    }
    try{
        let spaceId = req.params.id;

        let favorites = await userData.updateSavedSpaces(req.session.userId, spaceId);
        if(favorites.userSavedSpaces != true) throw "space cannot be favorited";

    }catch(e){
        res.status(400).render('users/error', {hasError: true, error: e});
    }
})

router.post('/savedSpacesDelete/:id', async (req, res) => {
    if(!req.session.email){
        res.status(400).redirect('/user/login');
        return;
    }
    try{
        let spaceId = req.params.id;

        let unFavorite = await userData.deleteSavedSpaces(req.session.userId, spaceId);
        if(unFavorite.userSavedSpacesDeleted != true) throw "space cannot be unfavorited";

    }catch(e){
        res.status(400).render('users/error', {hasError: true, error: e});
    }
})

module.exports = router;