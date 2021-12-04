const express = require('express');
const router = express.Router();
const data = require("../data");
const bookingData = data.bookings;

//get booking by booking ID
router.get("/:id", async function (req, res) {
    try {
        const bookingInfo = await bookingData.getbookingById(req.params.id); // title, user(id), post(id), startDate, time
        // console.log(req.params.id)
        res.json(bookingInfo);
    }
    catch (e) {
        res.status(404).json({ message: "'booking' item not found!" });
    }
});


//get all bookings by Space ID
router.get("/spaceId/:id", async function (req, res) {
    try {
        const bookingInfo = await bookingData.getAllbookingsBySpaceId(req.params.id); // 
        // console.log(req.params.id)
        res.json(bookingInfo);
    }
    catch (e) {
        res.status(404).json({ message: "'booking' item not found!" });
    }
});

//get all bookings by User ID
router.get("/userId/:id", async function (req, res) {
    try {
        const bookingInfo = await bookingData.getAllbookingsByUserId(req.params.id); // 
        // console.log(req.params.id)
        res.json(bookingInfo);
    }
    catch (e) {
        res.status(404).json({ message: "'booking' item not found!" });
    }
});

//get bookings by space ID
// router.get('/space/:id', async (req, res) => {
//     let idInfo = req.params.id;
//     if (!idInfo) {
//         res.status(400).json({ error: 'You must provide id to get a space' });
//         return;
//     }
//     try {
//         const spaceById = await bookingData.getAllbookingsBySpaceId(idInfo);
//         res.json(spaceById);
//     } catch (error) {
//         // console.log(error);
//         res.status(404).json({ error: 'booking not found' });
//     }
// });

router.get("/", async function (req, res) {
    try {
        const bookingList = await bookingData.getAllbookings();
        res.json(bookingList);
    }
    catch (e) {
        res.status(500).send();
    }
});

// add
router.post("/:id", async (req, res) => {
    let bookingInfo = req.body;
    if (!bookingInfo) {
        res.status(400).json({ error: 'You must provide data to create a booking' });
        return;
    }

    // const {title, user, space, startDate} = bookingInfo;
    const { spaceId, userId, startDate, endDate, totalPrice } = bookingInfo;
    if (!spaceId || typeof spaceId !== 'string') {
        res.status(400).json({ error: 'You must provide a spaceId for the booking' });
        return;
    }
    if (!userId) {
        res.status(400).json({ error: 'You must provide user id for the booking' });
        return;
    }

    if (!startDate || typeof startDate !== 'string') {
        res.status(400).json({ error: 'booking startDate can not be empty.' });
        return;
    }
  
    try {
        // const newbooking = await bookingData.addbooking(title, user, space, startDate);
        const newbooking = await bookingData.addbooking(spaceId, userId, startDate,endDate,totalPrice);
        
        res.status(200).send(newbooking)
    } catch (e) {
        res.status(500).json({ error: e })
    }
});

// router.post('/remove/:id', async (req, res) => {
//     if (!req.params.id) {
//         res.status(400).json({ error: 'You must Supply an ID to delete' });
//         return;
//     }

//     try {
//         let deletebooking = await bookingData.removebooking(req.params.id);
//         if (deletebooking) {
//             res.status(200).json(deletebooking);
//             // return res.redirect("/spaces/" + req.params.spaceId);
//         } else {
//             return res.status(404).send();
//         }
//         //res.json({deleted: true, data: toBeDeletedbooking});
//     } catch (e) {
//         res.status(500).json({ error: e });
//     }

// });

router.delete('/:id', async (req, res) => {
    let idInfo = req.params.id;
    if (!idInfo) {
        res.status(400).json({ error: 'You must provide id to get a space' });
        return;
    }
    try {
        const spaceById = await bookingData.removebooking(idInfo);
        const allbookingsAtThisspace = await bookingData.getAllbookingsBySpaceId(spaceById.resId);
        const objToBeUp = await spacesData.get(spaceById.resId);
     
        //console.log(objToBeUp);

        let averageendDate = 0;
        for (var i = 0; i < allbookingsAtThisspace.length; i++) {
            averageendDate += allbookingsAtThisspace[i].endDate;

        }
        averageendDate = averageendDate / allbookingsAtThisspace.length;
      
        //console.log(averageendDate);
        objToBeUp.overallendDate = averageendDate;
        const addbookingsTospacesInfo = await spacesData.update(spaceById.resId, objToBeUp);

        let resObj = {
            bookingId: spaceById.bookingId,
            deleted: true,

        };

        res.json(resObj);
    } catch (error) {
        //console.log(error);
        res.status(404).json({ error: 'booking not found' });
    }
});


// this function should be added into "data/posts.js"
async function getListOfbookingsInPost(postId) {
    const thisPost = await post.getPost(postId);
    const listOfbookings = thisPost.bookings; // an array of IDs
    return listOfbookings;
}


module.exports = router;




