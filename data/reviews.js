const mongoCollections = require('../config/mongoCollections');
const reviews = mongoCollections.reviews;
const verify = require('./verify');
const spaces = require('./spaces');
const comments = require('./comments');
let { ObjectId } = require('mongodb');

module.exports = {
    async getReviewById(reviewId) {
        if (!verify.validString(reviewId)) throw 'Review id is not a valid string.';

        let parsedId = ObjectId(reviewId);

        const reviewCollection = await reviews();
        let review = await reviewCollection.findOne({ _id: parsedId });
        if (review === null) throw 'No review with that id.';
        review._id = review._id.toString();

        return review;
    },

    //this one neeed to be updated
    async createReview(reviewerId, spaceId, reviewText) {
        if (!verify.validString(reviewerId)) throw 'Reviewer id is not a valid string.';
        if (!verify.validString(spaceId)) throw 'space id is not a valid string.';
        if (!verify.validString(reviewText)) throw 'Review text is not a valid string.';


        let newReview = {
            reviewerId: reviewerId,
            spaceId: spaceId,
            reviewText: reviewText,
            rating: [],

        };

    
        const reviewCollection = await reviews();
        const insertInfo = await reviewCollection.insertOne(newReview);
        if (insertInfo.insertedCount === 0) throw 'Could not add review.';

        const newId = insertInfo.insertedId;

        const finReview = await this.getReviewById(newId.toString());
        return finReview;
    },

   
   
    async deleteReview(reviewId) {
        if (!verify.validString(reviewId)) throw 'Review id is not a valid string.';

        /* Remove all comments on this review */
        let commentList = comments.getAllCommentsOfReview(reviewId);
        if (commentList.length > 0) {
            for (let commentId of commentList) {
                await comments.deleteComment(commentId);
            }
        }

        let review = await this.getReviewById(reviewId);

        spaces.updateMetrics(review.spaceId, review.metrics, false);

        /* delete review from DB */
        const reviewCollection = await reviews();
        const deletionInfo = await reviewCollection.deleteOne({ _id: ObjectId(reviewId) });
        if (deletionInfo.deletedCount === 0) throw `Could not delete review with id of ${reviewId}.`;

        return review;
    },

    async getAllReviewsOfUser(reviewerId) {
        if (!verify.validString(reviewerId)) throw 'Reviewer id is not a valid string.';

        const reviewCollection = await reviews();
        const reviewList = await reviewCollection.find({ 'reviewerId': { $eq: reviewerId } }).toArray();
        for (let x of reviewList) {
            x._id = x._id.toString();
        }

        return reviewList;
    },

    async getAllReviewsOfspace(spaceId) {
        if (!verify.validString(spaceId)) throw 'space id is not a valid string.';

        const reviewCollection = await reviews();
        const reviewList = await reviewCollection.find({ 'spaceId': { $eq: spaceId } }).toArray();
        for (let x of reviewList) {
            x._id = x._id.toString();
        }

        return reviewList;
    }
}

