const mongoCollections = require('../config/mongoCollections');
const { ObjectId } = require('mongodb');
const reviews = mongoCollections.reviews;
// const spacesCollection = require("./spaces.js");

async function getReviewById(id) {
    if (!id || typeof id !== "string")
        throw 'You must provide an id to search for';
    let reviewCollection = await reviews();
    let objId = ObjectId.createFromHexString(id);
    let reviewGoal = await reviewCollection.findOne({ _id: objId });
    if (reviewGoal === null)
        throw 'No review with that id';
    return reviewGoal;
}

async function getAllReviews() {
    let reviewCollection = await reviews();
    let allreviews = await reviewCollection.find({}).toArray();
    return allreviews;
}

async function addReview(spaceId, userId, content,rating) {

    if (!spaceId || typeof spaceId !== "string")
        throw 'you should input a string as the spaceId';
    if (!userId || typeof userId !== "string")
        throw 'you should input a string as the userId';
    if (!content || typeof content !== "string")
        throw 'you should input a string as the content';

    let reviewCollection = await reviews();
    let newreview = {
        spaceId: spaceId,
        userId: userId,
        content: content,
        rating: rating,
        datetime: new Date().toLocaleDateString()
    }
    let insertInfo = await reviewCollection.insertOne(newreview);
    if (insertInfo === null)
        throw 'Something wrong when adding the review';
    let newreviewId = insertInfo.insertedId;
    let reviewCreated = await getReviewById(newreviewId.toHexString());

    // await spacesCollection.addreviewIdTospace(spaceId, newreviewId.toHexString());

    return reviewCreated;
}

 async function removeReview(id) {
    if (!verify.validString(id)) throw 'review id must be a valid string.';

    let objId = ObjectId(id.trim());

    let existingData = await this.getReviewById(id);

    if(existingData === null) throw 'review does not exist for the given Id'

           
    //delete reviews related to respective Id

    //check delete info.(track)

    let reviewCollection = await reviews();
    let deletionInfo = await reviewCollection.deleteOne({ _id: objId });
    if (deletionInfo.deletedCount === 0) {
        throw `Could not delete the review with id of ${id}`;
    }

    return true;
}


module.exports = {
    getReviewById,
    addReview,
    removeReview,
    getAllReviews
}

