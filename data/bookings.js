const mongoCollections = require('../config/mongoCollections');
const { ObjectId } = require('mongodb');
const bookings = mongoCollections.bookings;
const space = require("./space.js");
const users = require("./users.js");

async function getbookingById(id) {
    if (!id || typeof id !== "string")
        throw 'You must provide an id to search for';
    let bookingCollection = await bookings();
    let objId = ObjectId.createFromHexString(id);
    let bookingGoal = await bookingCollection.findOne({ _id: objId });
    if (bookingGoal === null)
        throw 'No booking with that id';
    return bookingGoal;
}

async function getAllbookings() {
    let bookingCollection = await bookings();
    let allbookings = await bookingCollection.find({}).toArray();
    return allbookings;
}

async function addbooking(spaceId, userId, startDate,endDate,totalPrice) {

    if (!spaceId || typeof spaceId !== "string")
        throw 'you should input a string as the spaceId';
    if (!userId || typeof userId !== "string")
        throw 'you should input a string as the userId';
    if (!startDate || typeof startDate !== "string")
        throw 'you should input a string as the startDate';

    let bookingCollection = await bookings();
    let newbooking = {
        spaceId: spaceId,
        userId: userId,
        startDate: startDate,
        endDate: endDate,
            totalPrice,totalPrice
        
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
        var parsedId = ObjectId(id);
    } catch (error) {
        throw `id  must be  a valid ObjectId`;
    }
    const SpacesCollection = await space();
    const bookingsList = await SpacesCollection.findOne({ _id: parsedId }, { projection: { bookings: 1, _id: 0 } });
    if (bookingsList === null || bookingsList.bookings.length == 0) throw `no bookings for the Space _id are found`;
    for (let i = 0; i < bookingsList.bookings.length; i++) {
        bookingsList.bookings[i]._id = bookingsList.bookings[i]._id.toString();
    }

    return bookingsList.bookings;
    //Return object bookings in array.
}


async function getAllbookingsByUserId(id) {
    try {
        var parsedId = ObjectId(id);
    } catch (error) {
        throw `id  must be  a valid ObjectId`;
    }
    const usersCollection = await users();
    const bookingsList = await usersCollection.findOne({ _id: parsedId }, { projection: { bookings: 1, _id: 0 } });
    if (bookingsList === null || bookingsList.bookings.length == 0) throw `no bookings for the user _id are found`;
    for (let i = 0; i < bookingsList.bookings.length; i++) {
        bookingsList.bookings[i]._id = bookingsList.bookings[i]._id.toString();
    }

    return bookingsList.bookings;
    //Return object bookings in array.
}

async function removebooking(id) {
    try {
        var parsedId = ObjectId(id);
    } catch (error) {
        throw `id  must be  a valid ObjectId`;
    }


    const spacesCollection = await space();
    const targetspace = await spacesCollection.findOne({ 'bookings._id': parsedId });
    //console.log(targetspace);
    //console.log("lll");
    if (targetspace === null) throw `cannot found `;

    const bookingDeleteFromspace = await spacesCollection.updateOne({ _id: targetspace._id }, { $pull: { bookings: { _id: parsedId } } });

    let spaceObj = {
        bookingId: id,
        deleted: true,
        spaceId: targetspace._id
    };
    return spaceObj;
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
    getAllbookings,
    getAllbookingsBySpaceId,
    getAllbookingsByUserId
}

