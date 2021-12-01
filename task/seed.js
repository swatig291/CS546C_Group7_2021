const dbConnection = require('../config/mongoConnection');
const data = require('../data/');
const spaceData = data.space;
const userData = data.users;
const commentData = data.comments;
const reviews = require('../data/reviews.js');
const bookings = require('../data/bookings.js');

async function main() {
    const db = await dbConnection();
    await db.dropDatabase();
    // spaceName, address, spaceDim,price,hostId

    let address1 = {};
       address1['streetAddress']='Abc';
       address1['city'] = 'ab';
       address1['state'] = 'NJ';
       address1['zip'] = '07306';
       let address2 = {};
       address2['streetAddress']='Def';
       address2['city'] = 'de';
       address2['state'] = 'NY';
       address2['zip'] = '07300';
       let address3 = {};
       address3['streetAddress']='Ijk';
       address3['city'] = 'ij';
       address3['state'] = 'NY';
       address3['zip'] = '07340';
       let address4 = {};
       address4['streetAddress']='Lmn';
       address4['city'] = 'lm';
       address4['state'] = 'NJ';
       address4['zip'] = '07305';
       let spaceDim = {};
          spaceDim['length'] = '45';
          spaceDim['width'] = '70';
          spaceDim['height'] = '75';

    const space1   =  await spaceData.createSpace('A',  address1,  spaceDim, '45','619ad029ff55aec21408f9b8','imagePath1');
    const space2   = await spaceData.createSpace(' B', address2,  spaceDim, '50' ,'619ad029ff55aec21408f9b8','imagePath1');
    const space3   = await spaceData.createSpace('C',  address3,  spaceDim, '55','619ad029ff55aec21408f9b8','imagePath1');
    const space4   = await spaceData.createSpace('D',  address4,  spaceDim, '60','619ad029ff55aec21408f9b8','imagePath1');
   
    
    // Users
    // firstName, lastName, email, password, phoneNumber, ssn

    const user1 = await userData.createUser('user1', 'allusers', 'user1@gmail.com', '12345slfsf', '2543525331', '123456781');
    const user2 = await userData.createUser('user2', 'allusers', 'user2@gmail.com', '1234fskfsl', '2543525332', '123456782');
    const user3 = await userData.createUser('user3', 'allusers', 'user3@gmail.com', '12345slfls', '2543525333', '123456783');
    const user4 = await userData.createUser('user4', 'allusers', 'user4@gmail.com', '1234afafgg', '2543525334', '123456784');
    const user5 = await userData.createUser('user5', 'allusers', 'user5@gmail.com', '1234afsfkf', '2543525335', '123456785');
    
    // Commentss
    // userId, spaceId, comment, date
    // const comment1 = await commentData.createComment("619ad029ff55aec21408f9b9", space1._id, 'Is the space easy to be found?', '11/30/2021');
    // const comment2 = await commentData.createComment("619ad029ff55aec21408f2b6", space2._id, 'Is the space waterproof?', '11/30/2021');
    // const comment3 = await commentData.createComment("439ad029ff55aec36985f9b8", "61a59108002aaa74fa8d5209", 'Is the host of this space easy to communicate?', '11/30/2021');
    // const comment4 = await commentData.createComment("259ad029ff55aec21408zsr8", "61a59108002aaa74fa8d520a", 'Can I store my car here?', '11/30/2021');


     //creat reviews
    //spaceId,userId, content,rating
    let c1 = await reviews.addReview(space1._id, "12345slfsf", "nice", 5);
    let c2 = await reviews.addReview(space2._id, "12345slfsf", "just so so", 4);
    let c3 = await reviews.addReview('619ad029ff55aec21408f9b8', "12345slfls", "awesome",5);
    let c4 = await reviews.addReview('619ad029ff55aec21408f9b8', "1234afsfkf", "bad",1);
  //creat booking
    //addbooking(spaceId, userId, startDate, endDate, totalPrice)
    const b1 = await bookings.addbooking('619ad029ff55aec21408f9b8', "12345slfsf", "2019/01/11", "2019/03/11",5);
    const b2 = await bookings.addbooking('619ad029ff55aec21408f9b8', "12345slfsf", "2019/01/11", "2019/03/11",2);
    const b3 = await bookings.addbooking('619ad029ff55aec21408f9b8', "12345slfsf", "2019/01/11", "2019/03/11",3);
    const b4 = await bookings.addbooking('619ad029ff55aec21408f9b8', "12345slfsf", "2019/01/11", "2019/03/11",1);

    console.log('Done seeding database');
    // await db.serverConfig.close();
}

main();