const mongoCollections = require('../config/mongoCollections');
let { ObjectId } = require('mongodb');
const bookings = mongoCollections.bookings;
const space = require("./space.js");
const users = require("./users.js");
const verify = require("./util");


async function getbookingById(id) {
    if (!id || typeof id !== "string")
        throw 'You must provide an id to search for';
    if(!verify.validId(id)) throw 'the id is invalid';
    let bookingCollection = await bookings();
    let objId = ObjectId.createFromHexString(id);
    let bookingGoal = await bookingCollection.findOne({ _id: objId });
    if (bookingGoal === null)
        throw 'No booking with that id';
    return bookingGoal;
}

// async function getAllbookings() {
//     let bookingCollection = await bookings();
//     let allbookings = await bookingCollection.find({}).toArray();
//     return allbookings;
// }

async function addbooking(spaceId, userId, startDate,endDate,totalPrice) {

    if (!verify.validDate(startDate)) throw 'select proper start Date';
    if (!verify.validDate(endDate)) throw 'select proper end Date';
    if (!verify.validString(spaceId))  throw 'space id must be a valid string.';
    if (!verify.validString(userId))  throw 'user id must be a valid string.';
    if (!verify.validNumber(totalPrice))  throw 'total price must be a valid number.';
    if (!verify.validId(spaceId))  throw 'space id must be a valid.';
    if (!verify.validId(userId))  throw 'user id must be a valid.';
    let bookingCollection = await bookings();

    let newbooking = {
        spaceId: spaceId,
        userId: userId,
        startDate: startDate,
        endDate: endDate,
        totalPrice:totalPrice
        
    }
    let insertInfo = await bookingCollection.insertOne(newbooking);
    if (insertInfo === null)
        throw 'Something wrong when adding the booking';
    let newbookingId = insertInfo.insertedId;
    let bookingCreated = await getbookingById(newbookingId.toHexString());

    // await spacesCollection.addbookingIdTospace(spaceId, newbookingId.toHexString());

    return bookingCreated;
}

async function getAllbookingsBySpaceId(id) {
    try {
        if (!verify.validString(id))  throw 'id must be a valid string.';
        var parsedId = ObjectId(id);
    } catch (error) {
        throw `id  must be  a valid ObjectId`;
    }
    const bookingCollection = await bookings();
    const bookingsList = await bookingCollection.find({'spaceId': { $eq: id}}).toArray();
    if (bookingsList === null || bookingsList.length == 0) throw `no bookings for the Space _id are found`;
    
    bookingsList.map(verify.convertId)

    return bookingsList;
  
}

async function getAllbookingsByUserId(id) {
    try {
        if (!verify.validString(id))  throw 'id must be a valid string.';
        var parsedId = ObjectId(id);
    } catch (error) {
        throw `id  must be  a valid ObjectId`;
    }
    const bookingCollection = await bookings();
    const bookingsList = await bookingCollection.find({'userId': { $eq: id}}).toArray();
    if (bookingsList === null || bookingsList.bookingCollectionlength == 0) throw `no bookings for the user _id are found`;
    bookingsList.map(verify.convertId)

    return bookingsList;
    
}

async function removebooking(id) {
    try {
        if (!verify.validString(id))  throw 'id must be a valid string.';
        var parsedId = ObjectId(id);
    } catch (error) {
        throw `id  must be  a valid ObjectId`;
    }
    const bookingCollection = await bookings();
    const targetBooking = await bookingCollection.findOne({ _id: parsedId });
    //console.log(targetspace);
    //console.log("lll");
    if (targetBooking === null) throw `Booking is not available `;

        let deletionInfo = await bookingCollection.deleteOne({ _id: parsedId });
        if (deletionInfo.deletedCount === 0) {
            throw `Could not delete the booking with id of ${id}`;
        }
    
        return true;

}



//  async function removebooking(id) {
//     if (!verify.validString(id)) throw 'booking id must be a valid string.';

//     let objId = ObjectId(id.trim());

//     let existingData = await this.getbookingById(id);

//     if(existingData === null) throw 'booking does not exist for the given Id'


//     //delete bookings related to respective Id

//     //check delete info.(track)

//     let bookingCollection = await bookings();
//     let deletionInfo = await bookingCollection.deleteOne({ _id: objId });
//     if (deletionInfo.deletedCount === 0) {
//         throw `Could not delete the booking with id of ${id}`;
//     }

//     return true;
// }


module.exports = {
    getbookingById,
    addbooking,
    removebooking,
    getAllbookingsBySpaceId,
    getAllbookingsByUserId
}

