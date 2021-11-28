const mongoCollections = require('../config/mongoCollections');
const comments = mongoCollections.comments;
let {ObjectId} = require('mongodb');

module.exports = {
    async getCommentById(commentId) {
        if (commentId === undefined || commentId === null) {
            throw "commentId must be supplied!"
        }
        if (typeof commentId !== "string") {
            throw "The type of commentId must be string!"
        }
        if(commentId.length !== 24){
            throw "Invaild commentId!"
        }
        let commentId = ObjectId(commentId);
       
        const commentCollection = await comments();
        let comment = await commentCollection.findOne({ _id: commentId });
        if (comment === null){
            throw 'No comment with that id';
        }
        comment._id = comment._id.toString();
        return comment;
    },

    async createComment(userId, spaceId, comment, date) {
        if (userId === undefined || userId === null || spaceId === undefined || spaceId === null
            || comment === undefined || comment === null || date === undefined || date === null) {
            throw "All fields need to have valid values!"
        }
        if (typeof userId !== "string" || typeof spaceId !== "string" || typeof comment !== "string" ||
            typeof date !== "string" || userId.match(/^[ ]*$/) || spaceId.match(/^[ ]*$/) || comment.match(/^[ ]*$/) || date.match(/^[ ]*$/)) {
            throw "Some arguments type are not vaild!"
        }
        if(uersData.get(userId) == null){
            throw "No user exists with that userId!"
        }
        if(spacesData.get(spaceId) == null){
            throw "No space exists with that spaceId!"
        }
        if(userId.length !== 24){
            throw "Invaild userId!"
        }
        if(spaceId.length !== 24){
            throw "Invaild spaceId!"
        }
        let userId = ObjectId(userId);
        let spaceId = ObjectId(spaceId);

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
            _id:ObjectId(),
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
        if (commentId === undefined || commentId === null) {
            throw "commentId must be supplied!"
        }
        if (typeof commentId !== "string") {
            throw "The type of commentId must be string!"
        }
        if(commentId.length !== 24){
            throw "Invaild commentId!"
        }
        let commentId = ObjectId(commentId);
        
        const commentCollection = await comments();
        const deletionInfo = await commentCollection.deleteOne({ _id: commentId });
        if (deletionInfo.deletedCount === 0){
            throw `Could not delete comment with id of ${commentId}.`;
        }
        return 'Successfully delete!'; 
    },
}