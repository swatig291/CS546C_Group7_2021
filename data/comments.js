const mongoCollections = require('../config/mongoCollections');
const comments = mongoCollections.comments;
const verify = require('./util');
const userData = require('./users');
const spaceData = require('./space');
let {ObjectId} = require('mongodb');

module.exports = {
    async getCommentById(commentId) {
        if (!verify.validString(commentId)){
            throw 'Invaild commentId!'
        }
        commentId = ObjectId(commentId);
        const commentCollection = await comments();
        let comment = await commentCollection.findOne({ _id: commentId});
        if (comment === null){
            throw 'No comment with that id';
        }
        comment._id = comment._id.toString();
        return comment;
    },

    async createComment(userId, spaceId, comment) {
        if (!verify.validString(userId)){
            throw 'Invaild userId!'
        }
        if (!verify.validString(spaceId)){
            throw 'Invaild spaceId!'
        }
        if (!verify.validString(comment)){
            throw 'Invaild comment!'
        }
        
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

        let newComment = {
            userId: userId, 
            spaceId: spaceId, 
            comment: comment,
            date: currentDate
        };

        const commentCollection = await comments();
        const insertInfo = await commentCollection.insertOne(newComment);
        if(insertInfo.insertedCount === 0){
            throw 'Could not add comment.';
        }
        const newId = insertInfo.insertedId;
        const newcomment = await this.getCommentById(newId.toString());

        return newcomment;
    },

    async deleteComment(commentId) {
        if (!verify.validString(commentId)){
            throw 'Invaild commentId!'
        }
        commentId = ObjectId(commentId);
        const commentCollection = await comments();
        const deletionInfo = await commentCollection.deleteOne({ _id: commentId});
        if (deletionInfo.deletedCount === 0){
            throw `Could not delete comment with id of ${commentId}！`;
        }
        return 'Successfully delete!'; 
    },

    async getAllCommentsOfSpace(spaceId) {
        if (!verify.validString(spaceId)){
            throw 'Invaild spaceId!'
        }

        spaceId = ObjectId(spaceId);
        const commentCollection = await comments();
        const commentList = await commentCollection.find({'spaceId': { $eq: spaceId}}).toArray();
        
        for(i = 0; i < commentList.lenght; i++) {
            commentList[i]._id = commentList[i]._id.toString();
        }
        return commentList; 
    },

    async getAllCommentsOfUser(userId) {
        if (!verify.validString(userId)){
            throw 'Invaild userId!'
        }
        userId = ObjectId(userId);
        const commentCollection = await comments();
        const commentList = await commentCollection.find({'userId': { $eq: userId}}).toArray();
        
        for(i = 0; i < commentList.lenght; i++) {
            commentList[i]._id = commentList[i]._id.toString();
        }
        return commentList; 
    },

    async updateComment(id, comment) {
        if (!verify.validString(id)){
            throw 'Invaild id!'
        }
        if (!verify.validString(comment)){
            throw 'Invaild comment111!'
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
        const commentCollection = await comments();
        const updateComment = {
            comment: comment,
            date: currentDate
        };
        const updateInfo = await commentCollection.updateOne({ _id: objId }, {$set: updateComment});
        if (updateInfo.modifiedCount === 0) {
            throw "Error (updateComment): Failed to update comment in Database.";
        }
        return  await this.getCommentById(id);
    }
}