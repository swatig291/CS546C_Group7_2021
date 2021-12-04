const mongoCollections = require('../config/mongoCollections');
const spaces = mongoCollections.space;
const verify = require('./util');

let { ObjectId } = require('mongodb');
// {
//     "spaceName" : "spaceName1",
//             "spaceDim": {
//                         "length": "45",
//                         "width": "45",
//                         "height": "45"
//                     },
//             "address": {
//                             "streetAddress": "streetAddress1",
//                             "city": "city",
//                             "state":"state",
//                             "zip": "07306"
//                             },
//             "price": "50",
//             "hostId": "507f1f77bcf86cd799439011",
//             "description": "description"
// }
module.exports = {
    // Returns an array of all the Space in the database
    async getAllSpace() {
        const spaceCollection = await spaces();
        const allSpace = await spaceCollection.find({}).toArray();
        // Change all _id values to strings
        return allSpace.map(verify.convertId);
    },

    // Returns: a singular document (JSON) from the database
    async getSpaceById(id) {
        if (!verify.validString(id)) throw 'Space id must be a valid string.';
        let objId = ObjectId(id.trim());

        const spaceCollection = await spaces();

        const space = await spaceCollection.findOne({_id: objId});
        if (!space) throw `No space found with id=${id}.`;

        // Convert _id field to string before returning
        return verify.convertId(space);
    },

   
    async createSpace(spaceName, address, spaceDim,price,hostId,newDesc) {
        if (!verify.validString(spaceName))    throw 'Space name must be a valid string.';

        if (!verify.validString(address.streetAddress)) throw 'Street address must be a valid string.';
        if (!verify.validString(address.city)) throw 'Space city must be a valid string.';
        if (!verify.validString(address.state)) throw 'Space state must be a valid string.';
        if (!verify.validZip(address.zip)) throw 'Space zip must be a valid string.';

        if (!verify.validNumber(spaceDim.length)) throw 'Length must be a number';
        if (!verify.validNumber(spaceDim.width)) throw 'Width must be a number';
        if (!verify.validNumber(spaceDim.height)) throw 'Length must be a number';

        if (!verify.validNumber(price)) throw 'Length must be a number';
        if (!verify.validString(hostId)) throw 'Host id must be a valid string.';
        if(!verify.validString(newDesc)) throw 'Image Path must be valid string';

        const spaceCollection = await spaces();
        //check for duplicate adress before adding 
        const allSpace = await this.getAllSpace();
            for (let x of allSpace) {
                //city, state and zip can be same for multiple adress so comparing only street adress.
                if (x.address.streetAddress.toLowerCase() === address.streetAddress.toLowerCase()) throw 'A space with this address already exists.';
            }
                    const newSpace = {
            spaceName: spaceName.trim(),
            spaceDim: {
                        length: spaceDim.length,
                        width: spaceDim.width,
                        height: spaceDim.height,
                    },
            address: {
                            streetAddress: address.streetAddress.trim(),
                            city: address.city.trim(),
                            state: address.state.trim(),
                            zip: address.zip.trim()},
            price: price.trim(),
            spaceVolume: spaceDim.length * spaceDim.width * spaceDim.height,
            hostId: hostId.trim(),
            rating: 0,
            description: newDesc
        };
        //Insert space into DB.
        const insertInfo = await spaceCollection.insertOne(newSpace);
        if (insertInfo.insertedCount === 0) throw 'Could not add space to database.';
        const id = insertInfo.insertedId.toString();

        return await this.getSpaceById(id);
    },
    //Update space details
    async updateSpace(id,spaceName, address, spaceDim,price,hostId,description) {
        if (!verify.validString(spaceName))    throw 'Space name must be a valid string.';

        if (!verify.validString(id))  throw 'Space id must be a valid string.';

        if (!verify.validString(address.streetAddress)) throw 'Street address must be a valid string.';
        if (!verify.validString(address.city)) throw 'Space city must be a valid string.';
        if (!verify.validString(address.state)) throw 'Space state must be a valid string.';
        if (!verify.validZip(address.zip)) throw 'Space zip must be a valid string.';

        if (!verify.validNumber(spaceDim.length)) throw 'Length must be a number';
        if (!verify.validNumber(spaceDim.width)) throw 'Width must be a number';
        if (!verify.validNumber(spaceDim.height)) throw 'Length must be a number';

        if (!verify.validNumber(price)) throw 'Length must be a number';
        if (!verify.validString(hostId)) throw 'Host id must be a valid string.';
        if(!verify.validString(description)) throw 'Image Path must be valid string';

        let objId = ObjectId(id.trim());
        let existingData = await this.getSpaceById(id);

        if(existingData === null) throw 'Space does not exist for the given Id'
    
        const spaceCollection = await spaces();
                const updateSpace = {
                    spaceName: spaceName.trim(),
                    spaceDim: {
                                length: spaceDim.length,
                                width: spaceDim.width,
                                height: spaceDim.height,
                            },
                    address: {
                                    streetAddress: address.streetAddress.trim(),
                                    city: address.city.trim(),
                                    state: address.state.trim(),
                                    zip: address.zip.trim()},
                    price: price.trim(),
                    spaceVolume: spaceDim.length * spaceDim.width * spaceDim.height,
                    hostId: hostId.trim(),
                    rating: existingData.rating,
                    description: description
        };
        //check for existing data.

        //Update space into DB.
        const updateInfo = await spaceCollection.updateOne({ _id: objId }, {$set: updateSpace});
        if (updateInfo.modifiedCount === 0) throw "Error (updateSpace): Failed to update restaurant in Database.";
       
        return  await this.getSpaceById(id);

    },

    //Delete Space
    async  removeSpace(id) {
        if (!verify.validString(id)) throw 'Space id must be a valid string.';

        let objId = ObjectId(id.trim());

        let existingData = await this.getSpaceById(id);

        if(existingData === null) throw 'Space does not exist for the given Id'
    
        //delete comments related respective Id
             
        //delete reviews related to respective Id

        //check delete info.(track)
    
        let spaceCollection = await spaces();
        let deletionInfo = await spaceCollection.deleteOne({ _id: objId });
        if (deletionInfo.deletedCount === 0) {
            throw `Could not delete the space with id of ${id}`;
        }
    
        return true;
    },
    async getSpaceSearch(search) {
        if (!search) throw "Error (getSpaceSearch): Must provide search.";
        if (typeof(search) !== "string") throw "Error (getSpaceSearch): Search must be a string.";
        const spaceCollection = await spaces();
        const query = new RegExp(search, "i");
        const restaurantList = await spaceCollection.find({ $or: [ {'address.city': {$regex: query}}, {'address.state': {$regex: query}} ] }).toArray();
        if(restaurantList !== null)
        {
            restaurantList.map(verify.convertId)
        }
        return restaurantList;
    },

}