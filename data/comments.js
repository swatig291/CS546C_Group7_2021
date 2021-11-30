const mongoCollections = require('../config/mongoCollections');
const comments = mongoCollections.comments;
const verify = require('./util');
// const userData = require('./users');
// const spaceData = require('./space');
let {ObjectId} = require('mongodb');

module.exports = {
    async getCommentById(commentId) {
        if (!verify.validString(commentId)){
            throw 'Invaild commentId!'
        }

        commentId = ObjectId(commentId);

       
        const commentCollection = await comments();
        let comment = await commentCollection.findOne({ _id: ObjectId(commentId)});
        if (comment === null){
            throw 'No comment with that id';
        }
        comment._id = comment._id.toString();
        return comment;
    },

    async createComment(userId, spaceId, comment, date) {
        if (!verify.validString(userId)){
            throw 'Invaild userId!'
        }
        if (!verify.validString(spaceId)){
            throw 'Invaild spaceId!'
        }
        if (!verify.validString(comment)){
            throw 'Invaild comment!'
        }
        if (!verify.validString(date)){
            throw 'Invaild date!'
        }

        // if(userData.getUser(userId) == null){
        //     throw "No user exists with that userId!"
        // }
        // if(spaceData.getSpaceById(spaceId) == null){
        //     throw "No space exists with that spaceId!"
        // }
        

        if(uersData.getSpaceById(userId) == null){
            throw "No user exists with that userId!"
        }
        if(spacesData.getSpaceById(spaceId) == null){
            throw "No space exists with that spaceId!"
        }
         userId = ObjectId(userId);
        spaceId = ObjectId(spaceId);

        if (date.length !== 10 || date[2] !== '/' || date[5] !== '/') {
            throw "date is not vaild!"
        }
        const month = Number(date.substring(0,2));
        const day = Number(date.substring(3,5));
        const year = Number(date.substring(6)); 
        if(month < 1 || month > 12){
            throw "The month parameter is invalid!"
        }
        if( month === 1,3,5,7,8,10,12){
            if(day < 1 || day > 31){
                throw "The day parameter is invalid!"
            }
        }
        if( month === 2){
            if(year % 4 == 0 && year % 100 != 0 || year % 400 == 0){
                if(day < 1 || day > 29){
                    throw "The day parameter is invalid!"
                }
            }
            else if(day < 1 || day > 28){
                throw "The day parameter is invalid!"
            }
        }
        if( month === 4,6,9,11){
            if(day < 1 || day > 30){
                throw "The day parameter is invalid!"
            }
        }
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
        if(date != currentDate){
            throw "date is not vaild!"
        }

        let newComment = {
            userId: userId, 
            spaceId: spaceId, 
            comment: comment,
            date: date
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
        const deletionInfo = await commentCollection.deleteOne({ _id: ObjectId(commentId)});
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
        
        const commentCollection = await comments();
        const commentList = await commentCollection.find({'userId': { $eq: userId}}).toArray();
        
        for(i = 0; i < commentList.lenght; i++) {
            commentList[i]._id = commentList[i]._id.toString();
        }
        return commentList; 
    },
}