const express = require('express');
const router = express.Router();
const data = require("../data");
const xss = require('xss');
const verify = data.util;
const bookingData = data.bookings;

//get booking by booking ID
router.get("/:id", async function (req, res) {
    if(!req.session.email)
    {
      res.status(400).redirect('/user/login');
      return;
    }
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
    if(!req.session.email)
    {
      res.status(400).redirect('/user/login');
      return;
    }
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
router.get("/userId", async function (req, res) {
    if(!req.session.email)
    {
      res.status(400).redirect('/user/login');
      return;
    }
    try {
        const bookingInfo = await bookingData.getAllbookingsByUserId(req.session.userId); // 
        // console.log(req.params.id)
        res.json(bookingInfo);
    }
    catch (e) {
        res.status(404).json({ message: "'booking' item not found!" });
    }
});


router.get("/", async function (req, res) {
    if(!req.session.email)
    {
      res.status(401).redirect("/user/login")

    }
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
    if(!req.session.email)
  {
    res.status(400).redirect('/user/login');
    return;
  }
    let errors = [];
    let startDate = xss(req.body.startDate);
    let endDate = xss(req.body.endDate);
    let spaceId = xss(req.body.spaceId);
    let totalPrice = xss(req.body.totalPrice)

    if (!verify.validDate(startDate)) errors.push('select proper start Date');
    if (!verify.validDate(endDate)) errors.push('select proper end Date');
    if (!verify.validString(spaceId))  errors.push('Host id must be a valid string.');
    if (!verify.validNumber(totalPrice))  errors.push('Host id must be a valid string.');
    if (!verify.validId(spaceId))  errors.push('space id must be a valid.');
    let userId = req.session.userId;
    userId = xss(userId);
    if (!verify.validString(userId))  errors.push('user id must be a valid.');

    if (errors.length > 0) {
        return res.status(400).json(errors);
    }

    // const {title, user, space, startDate} = bookingInfo;
    
    
    try {
        // const newbooking = await bookingData.addbooking(title, user, space, startDate);
        const newbooking = await bookingData.addbooking(spaceId, userId, startDate,endDate,totalPrice);
        
        res.status(200).send(newbooking)
    } catch (e) {
        res.status(500).json({ error: e })
    }
});


router.delete('/:id', async (req, res) => {
    if(!req.session.email)
  {
    res.status(400).redirect('/user/login');
    return;
  }
    let idInfo = xss(req.params.id);
    if (!idInfo) {
        res.status(400).json({ error: 'You must provide id to get a space' });
        return;
    }
    try {
        const spaceById = await bookingData.removebooking(idInfo);
        res.json(spaceById);
    } catch (error) {
        //console.log(error);
        res.status(404).json({ error: 'booking not found' });
    }
});


module.exports = router;




