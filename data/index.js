const spaceData = require('./space');
const utilData = require('./util');
const commentData = require('./comments');
const userData = require('./users');
const reviewData = require('./reviews');
const bookingData = require('./bookings');

module.exports = {
    space: spaceData,
    util: utilData,
    comments: commentData,
    reviews: reviewData,
    bookings: bookingData,
    users: userData

};