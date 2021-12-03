const mongoCollections = require('../config/mongoCollections');
const users = mongoCollections.users;
const bcrypt = require('bcryptjs');
const verify = require('./util');

let { ObjectId } = require('mongodb');

// {
//    "first name": "firstname",
//    "last name": "lastname",
//    "email": "email",
//    "password": "hashed password",
//    "phoneNumber": "phoneNumber",
//    "savedStorages": [],
//    "SSN": ssn,
//    "isAHost": false
// }

let createUser = async function createUser(firstName, lastName, email, password, phoneNumber, ssn){

    if(!verify.validString(firstName)) throw 'First Name must be a valid string.';
    if(!verify.validString(lastName)) throw 'Last Name must be a valid string.';

    if(!verify.validEmail(email)) throw 'Email is invalid.';

    if(password.trim().length<6 || password.indexOf(' ')>=0) throw 'The password is invalid';

    if(!verify.validNumber(phoneNumber)) throw 'The Phone Number is invalid';
    if(phoneNumber.length != 10) throw 'The Phone Number is invalid';

    if(!verify.validNumber(ssn)) throw 'The SSN is invalid';
    if(ssn.length != 9) throw 'The SSN is invalid';

    const userData = await users();
    let rounds = 16;

    const emailFinder = await userData.findOne({email: email});
    const phoneNumberFinder = await userData.findOne({phoneNumber: phoneNumber});
    const ssnFinder = await userData.findOne({ssn: ssn});
    
    if(emailFinder != null) throw 'Email already exists';
    if(phoneNumberFinder != null) throw 'Phone Number already exists';
    if(ssnFinder != null) throw 'SSN already exists';
    
    const newUser = {
        firstName: firstName,
        lastName: lastName,
        email: email,
        password: await bcrypt.hash(password, rounds),
        phoneNumber: phoneNumber,
        savedStorages: [],
        ssn: ssn,
        isAHost: false
    }

    const newInsertedUser = await userData.insertOne(newUser);
    if (newInsertedUser.insertedCount === 0) throw 'Could not add new user';

    return {userInserted: true};
}

let getUser = async function getUser(id){

    if(!verify.validString(id)) throw 'Id is invalid.';

    const userData = await users();
    let parseId = ObjectId(id);

    const finder = await userData.findOne({_id: parseId});
    if(finder == null) throw 'There is no user with the given ID';

    return verify.convertId(finder);
}

let updateUser = async function updateUser(id, firstName, lastName, email, phoneNumber){

    if(!verify.validString(id)) throw 'Id is invalid.';
    if(!verify.validString(firstName)) throw 'First Name must be a valid string.';
    if(!verify.validString(lastName)) throw 'Last Name must be a valid string.';

    if(!verify.validEmail(email)) throw 'Email is invalid.';

    if(!verify.validNumber(phoneNumber)) throw 'The Phone Number is invalid';
    if(phoneNumber.length != 10) throw 'The Phone Number is invalid';

    const userData = await users();

    const emailFinder = await userData.findOne({email: email});
    const phoneNumberFinder = await userData.findOne({phoneNumber: phoneNumber});
    
    if(emailFinder != null) throw 'Email already exists';
    if(phoneNumberFinder != null) throw 'Phone Number already exists';

    let parseId = ObjectId(id);
    
    const newUpdatedUser = {
        firstName: firstName,
        lastName: lastName,
        email: email,
        phoneNumber: phoneNumber
    }

    const updatedUser = await userData.updateOne(
        { _id: parseId },
        { $set: newUpdatedUser }
    );

    if (updatedUser.modifiedCount === 0) {
        throw 'could not modify user successfully';
    }

    return {userModified: true};
}

let updateUserFirstName = async function updateUserFirstName(id, firstName){

    if(!verify.validString(id)) throw 'Id is invalid.';
    if(!verify.validString(firstName)) throw 'First Name must be a valid string.';
    
    const userData = await users();

    let parseId = ObjectId(id);
    
    const newUpdatedUser = {
        firstName: firstName
    }

    const updatedUser = await userData.updateOne(
        { _id: parseId },
        { $set: newUpdatedUser }
    );

    if (updatedUser.modifiedCount === 0) {
        throw "could not modify user's first name successfully";
    }

    return {userFirstNameModified: true};
}

let updateUserLastName = async function updateUserLastName(id, lastName){

    if(!verify.validString(id)) throw 'Id is invalid.';
    if(!verify.validString(lastName)) throw 'Last Name must be a valid string.';
    
    const userData = await users();

    let parseId = ObjectId(id);
    
    const newUpdatedUser = {
        lastName: lastName
    }

    const updatedUser = await userData.updateOne(
        { _id: parseId },
        { $set: newUpdatedUser }
    );

    if (updatedUser.modifiedCount === 0) {
        throw "could not modify user's last name successfully";
    }

    return {userLastNameModified: true};
}

let updateUserEmail = async function updateUserLastName(id, email){

    if(!verify.validString(id)) throw 'Id is invalid.';
    if(!verify.validEmail(email)) throw 'Email must be a valid string.';
    
    const userData = await users();

    let parseId = ObjectId(id);

    const emailFinder = await userData.findOne({email: email});
    if(emailFinder != null) throw 'Email already exists';
    
    const newUpdatedUser = {
        email: email
    }

    const updatedUser = await userData.updateOne(
        { _id: parseId },
        { $set: newUpdatedUser }
    );

    if (updatedUser.modifiedCount === 0) {
        throw "could not modify user's email successfully";
    }

    return {userEmailModified: true};
}

let updateUserPhoneNumber = async function updateUserPhoneNumber(id, phoneNumber){

    if(!verify.validString(id)) throw 'Id is invalid.';
    if(!verify.validNumber(phoneNumber)) throw 'The Phone Number is invalid';
    if(phoneNumber.length != 10) throw 'The Phone Number is invalid';
    
    const userData = await users();

    let parseId = ObjectId(id);

    const phoneNumberFinder = await userData.findOne({phoneNumber: phoneNumber});
    if(phoneNumberFinder != null) throw 'Phone Number already exists';
    
    const newUpdatedUser = {
        phoneNumber: phoneNumber
    }

    const updatedUser = await userData.updateOne(
        { _id: parseId },
        { $set: newUpdatedUser }
    );

    if (updatedUser.modifiedCount === 0) {
        throw "could not modify user's phone number successfully";
    }

    return {userPhoneNumberModified: true};
}

let checkUser = async function checkUser(email, password){

    if(!verify.validEmail(email)) throw 'Either Email or password is invalid.';

    if(password.trim().length<6 || password.indexOf(' ')>=0) throw 'Either Email or password is invalid.';

    const userData = await users();

    const finder = await userData.findOne({email: email});
    if(finder == null) throw 'Either Email or password is invalid.';

    passwordAuthenticator = await bcrypt.compare(password, finder['password']);

    if(passwordAuthenticator == true) return finder;
    else throw 'Either Email or password is invalid.';

}

module.exports = {
    createUser,
    getUser,
    updateUser,
    updateUserFirstName,
    updateUserLastName,
    updateUserEmail,
    updateUserPhoneNumber,
    checkUser
}