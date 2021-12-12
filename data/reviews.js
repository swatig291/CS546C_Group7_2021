const mongoCollections = require('../config/mongoCollections');
const reviews = mongoCollections.reviews;
const verify = require('./util');
const userData = require('./users');
const spaceData = require('./space');
let {ObjectId} = require('mongodb');

module.exports = {
    async getreviewById(reviewId) {
        if (!verify.validString(reviewId)){
            throw 'Invaild reviewId!'
        }
        reviewId = ObjectId(reviewId);
        const reviewCollection = await reviews();
        let review = await reviewCollection.findOne({ _id: reviewId});
        if (review === null){
            throw 'No review with that id';
        }
        review._id = review._id.toString();
        return review;
    },

    async createreview(userId, spaceId, review,rating) {
        if (!verify.validString(userId)){
            throw 'Invaild userId!'
        }
        if (!verify.validString(spaceId)){
            throw 'Invaild spaceId!'
        }
        if(!verify.validId(userId)) throw 'userId is invalid';
        if(!verify.validId(spaceId)) throw 'spaceId is invalid';

        if (!verify.validString(review)){
            throw 'Invaild review!'
        }

        if(!verify.validRating(rating)) throw 'rating is invalid';
        
        if(userData.getUser(userId) == null){
            throw "No user exists with that userId!"
        }
        
        if(spaceData.getSpaceById(spaceId) == null){
            throw "No space exists with that spaceId!"
        }
        
        userId = ObjectId(userId);
        spaceId = ObjectId(spaceId);

        var myDate = new Date();
        let cyear = myDate.getFullYear().toString();
        let cmonth = (myDate.getMonth()+1).toString();
        let cday = myDate.getDate().toString();
        if(cmonth.length ==1){
            cmonth = "0" + cmonth
        }
        if(cday.length ==1){
            cday = "0" + cday
        }
        const currentDate = cmonth + '/' + cday + '/' + cyear;

        let newreview = {
            userId: userId, 
            spaceId: spaceId, 
            review: review,
            rating:rating,
            date: currentDate
        };

        const reviewCollection = await reviews();
        const insertInfo = await reviewCollection.insertOne(newreview);
        if(insertInfo.insertedCount === 0){
            throw 'Could not add review.';
        }
        const newId = insertInfo.insertedId;
        const newreviews = await this.getreviewById(newId.toString());

        return newreviews;
    },

    async deletereview(reviewId) {
        if (!verify.validString(reviewId)){
            throw 'Invaild reviewId!'
        }
        if(!verify.validId(reviewId)) throw 'the reviewId is invalid';
        reviewId = ObjectId(reviewId);
        const reviewCollection = await reviews();
        const deletionInfo = await reviewCollection.deleteOne({ _id: reviewId});
        if (deletionInfo.deletedCount === 0){
            throw `Could not delete review with id of ${reviewId}！`;
        }
        return true; 
    },

    async getAllreviewsOfSpace(spaceId) {
        if (!verify.validString(spaceId)){
            throw 'Invaild spaceId!'
        }
        if(!verify.validId(spaceId)) throw 'the spaceId is invalid';

        spaceId = ObjectId(spaceId);
        const reviewCollection = await reviews();
        const reviewList = await reviewCollection.find({'spaceId': { $eq: spaceId}}).toArray();
        
        for(i = 0; i < reviewList.lenght; i++) {
            reviewList[i]._id = reviewList[i]._id.toString();
        }
        return reviewList; 
    },

    async getAllreviewsOfUser(userId) {
        if (!verify.validString(userId)){
            throw 'Invaild userId!'
        }
        if(!verify.validId(userId)) throw 'the userId is invalid';

        userId = ObjectId(userId);
        const reviewCollection = await reviews();
        const reviewList = await reviewCollection.find({'userId': { $eq: userId}}).toArray();
        
        for(i = 0; i < reviewList.lenght; i++) {
            reviewList[i]._id = reviewList[i]._id.toString();
        }
        return reviewList; 
    },

    async updatereview(id, review, rating) {
        if (!verify.validString(id)){
            throw 'Invaild id!'
        }
        if(!verify.validId(id)) throw 'the Id is invalid';
        
        if (!verify.validString(review)){
            throw 'Invaild review'
        }
        if(!verify.validRating(rating)) throw 'rating is invalid';
        
        let exitsingData = await this.getreviewById(id);
          if(exitsingData.review == review && exitsingData.rating == rating)
          {
              throw 'Nothing to change';
          }


        let objId = ObjectId(id.trim());
        var myDate = new Date();
        let cyear = myDate.getFullYear().toString();
        let cmonth = (myDate.getMonth()+1).toString();
        let cday = myDate.getDate().toString();
        if(cmonth.length ==1){
            cmonth = "0" + cmonth
        }
        if(cday.length ==1){
            cday = "0" + cday
        }
        const currentDate = cmonth + '/' + cday + '/' + cyear;
        const reviewCollection = await reviews();
        const updatereview = {
            review: review,
            rating:rating,
            date: currentDate
        };
        const updateInfo = await reviewCollection.updateOne({ _id: objId }, {$set: updatereview});
        if (updateInfo.modifiedCount === 0) {
            throw "Error (updatereview): Failed to update review in Database.";
        }
        return  {reviewModified: true}
    }
}