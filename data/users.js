const mongoCollections = require('../config/mongoCollections');
const users = mongoCollections.users;
const spaces = mongoCollections.space;
const reviews = mongoCollections.reviews;
const comments = mongoCollections.comments;
const bookings = mongoCollections.bookings;
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
    if(!verify.validId(id)) throw 'Id is invalid';

    const userData = await users();
    let parseId = ObjectId(id);

    const finder = await userData.findOne({_id: parseId});
    if(finder == null) throw 'There is no user with the given ID';

    return finder;
}

let getSavedSpaces = async function getUser(id){

    if(!verify.validString(id)) throw 'Id is invalid.';
    if(!verify.validId(id)) throw 'Id is invalid';

    const userData = await users();
    let parseId = ObjectId(id);

    const finder = await userData.findOne({_id: parseId});

    if(finder == null) throw 'There is no user with the given ID';
    
    return finder['savedStorages'];
}

let updateUser = async function updateUser(id, firstName, lastName, email, phoneNumber){

    if(!verify.validString(id)) throw 'Id is invalid.';
    if(!verify.validId(id)) throw 'Id is invalid';
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
    if(!verify.validId(id)) throw 'Id is invalid';
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
    if(!verify.validId(id)) throw 'Id is invalid';
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
    if(!verify.validId(id)) throw 'Id is invalid';
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
    if(!verify.validId(id)) throw 'Id is invalid';
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

let updateUserPassword = async function updateUserPassword(id, oldPassword, newPassword){

    if(!verify.validString(id)) throw 'Id is invalid.';
    if(!verify.validId(id)) throw 'Id is invalid';
    if(oldPassword.trim().length<6 || oldPassword.indexOf(' ')>=0) throw 'The Old Password is invalid.';
    if(newPassword.trim().length<6 || newPassword.indexOf(' ')>=0) throw 'The New Password is invalid.';
    
    const userData = await users();

    let parseId = ObjectId(id);
    let rounds = 16;

    const finder = await userData.findOne({_id: parseId});
    if(finder == null) throw 'The user cannot be found';

    passwordAuthenticator = await bcrypt.compare(oldPassword, finder['password']);
    if(passwordAuthenticator == false) throw 'The Old Password is invalid';
    
    const newUpdatedUser = {
        password: await bcrypt.hash(newPassword, rounds)
    }

    const updatedUser = await userData.updateOne(
        { _id: parseId },
        { $set: newUpdatedUser }
    );

    if (updatedUser.modifiedCount === 0) {
        throw "could not update user's Password successfully";
    }

    return {userPasswordModified: true};
}

let updateSavedSpaces = async function updateSavedSpaces(id, spaceId){
    if(!verify.validString(id)) throw 'Id is invalid.';
    if(!verify.validId(id)) throw 'Id is invalid';
    if(!verify.validString(spaceId)) throw 'spaceId is invalid.';
    if(!verify.validId(spaceId)) throw 'spaceId is invalid';

    const userData = await users();

    let parseId = ObjectId(id);

    const finder = await userData.findOne({_id: parseId});

    for(let i=0; i<finder['savedStorages'].length; i++){
        if(finder['savedStorages'][i] == spaceId) throw 'spaceId already exists';
    }

    updated = finder['savedStorages'].push(spaceId);
    
    const updatedUser = await userData.updateOne(
        { _id: parseId },
        { $set: finder }
    );
    
    if (updatedUser.modifiedCount === 0) {
        throw "could not update user's spaces successfully";
    }
    return {userSavedSpaces: true};
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

let deleteUser = async function deleteUser(id){

    if(!verify.validString(id)) throw 'Id is invalid.';
    if(!verify.validId(id)) throw 'Id is invalid';

    const userData = await users();
    const spaceData = await spaces();
    const commentData = await comments();
    const reviewData = await reviews();
    const bookingData = await bookings();

    let parseId = ObjectId(id);

    const delUser = await userData.deleteOne({_id: parseId});

    const userSpaces = await spaceData.find({hostId: id}).toArray();
    console.log(userSpaces);
    for(let i=0; i<userSpaces.length; i++){
        const delUserSpaceComments = await commentData.deleteMany({spaceId: userSpaces[i]._id});
        const delUserSpaceReviews = await reviewData.deleteMany({spaceId: userSpaces[i]._id});
        const delUserSpaceBookings = await bookingData.deleteMany({spaceId: userSpaces[i]._id.toString()});
    }
    const delUserSpaces = await spaceData.deleteMany({hostId: id});
    const delUserComments = await commentData.deleteMany({userId: parseId});
    const delUserReviews = await reviewData.deleteMany({userId: parseId});
    const delUserBookings = await bookingData.deleteMany({userId: id});


    if(delUser.deletedCount == 0) throw 'unable to delete user with the given ID';

    return {userDeleted: true};
}

let deleteSavedSpaces = async function deleteSavedSpaces(id, spaceId){
    if(!verify.validString(id)) throw 'Id is invalid.';
    if(!verify.validId(id)) throw 'Id is invalid';
    if(!verify.validString(spaceId)) throw 'spaceId is invalid.';
    if(!verify.validId(spaceId)) throw 'spaceId is invalid';

    const userData = await users();

    let parseId = ObjectId(id);

    const finder = await userData.findOne({_id: parseId});

    for(let i=0; i<finder['savedStorages'].length; i++){
        if(finder['savedStorages'][i] == spaceId) {
            updated = finder['savedStorages'].splice(i, 1);
        }
    }

    const updatedUser = await userData.updateOne(
        { _id: parseId },
        { $set: finder }
    );
   
    if (updatedUser.modifiedCount === 0) {
        throw "could not update user's spaces successfully";
    }
    return {userSavedSpacesDeleted: true};
}

module.exports = {
    createUser,
    getUser,
    getSavedSpaces,
    updateUser,
    updateUserFirstName,
    updateUserLastName,
    updateUserEmail,
    updateUserPhoneNumber,
    updateUserPassword,
    updateSavedSpaces,
    checkUser,
    deleteUser,
    deleteSavedSpaces
}