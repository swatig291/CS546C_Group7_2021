const express = require('express');
const router = express.Router();
const data = require('../data');
const spaceData = data.space;
const verify = data.util;
const xss = require('xss');

router.post('/add', async (req, res) => {
  let newName = xss(req.body.spaceName);

  const newAddress = req.body.address;
  let streetAddress = xss(newAddress.streetAddress);
  let city = xss(newAddress.city);
  let state = xss(newAddress.state);
  let zip = xss(newAddress.zip);

  let newSpaceDim = req.body.spaceDim;
  let length = xss(newSpaceDim.length);
  let width = xss(newSpaceDim.width);
  let height = xss(newSpaceDim.height);

  let newPrice = xss(req.body.price);
  let newHostId = xss(req.body.hostId);
  let newImagePath = xss(req.body.imagePath)

  let errors = [];
  if (!verify.validString(newName))  errors.push('Space name must be a valid string.');

  if (!verify.validString(streetAddress))  errors.push('Street address must be a valid string.');
  if (!verify.validString(city))  errors.push('Space city must be a valid string.');
  if (!verify.validString(state))  errors.push('Space state must be a valid string.');
  if (!verify.validZip(zip))  errors.push('Space zip must be a valid string.');

  if (!verify.validNumber(length)) errors.push('Length must be a number');
  if (!verify.validNumber(width))  errors.push('Width must be a number');
  if (!verify.validNumber(height))  errors.push('Length must be a number');

  if (!verify.validNumber(newPrice)) errors.push('Length must be a number');
  if (!verify.validString(newHostId))  errors.push('Host id must be a valid string.');
  if(!verify.validString(newImagePath))  errors.push('Image Path must be valid string');

  const allSpace = await spaceData.getAllSpace();
  for (let x of allSpace) {
    //city, state and zip can be same for multiple adress so comparing only street adress.
      if (x.address.streetAddress.toLowerCase() === streetAddress.toLowerCase()) errors.push('A space with this address already exists.');
  }
  // Do not submit if there are errors in the form
  if (errors.length > 0) {
      return res.status(400).json(errors);
  }

  try {
      const newSpace = await spaceData.createSpace(newName, newAddress, newSpaceDim, newPrice,newHostId,newImagePath);
      return res.json(newSpace);
  } catch(e) {
      res.status(500).json({error: e});
  }
});

router.get("/", async (req, res) => {
  try {
    let spaceList = await spaceData.getAllSpace();
    res.status(200).json(spaceList);
  } catch (e) {
    // Something went wrong with the server!
    console.log(e);
    res.status(404).send();
  }  
});

router.post('/edit', async (req, res) => {
  let newName = xss(req.body.spaceName);
  let id = xss(req.body.id);

  const newAddress = req.body.address;
  let streetAddress = xss(newAddress.streetAddress);
  let city = xss(newAddress.city);
  let state = xss(newAddress.state);
  let zip = xss(newAddress.zip);

  let newSpaceDim = req.body.spaceDim;
  let length = xss(newSpaceDim.length);
  let width = xss(newSpaceDim.width);
  let height = xss(newSpaceDim.height);

  let newPrice = xss(req.body.price);
  let newHostId = xss(req.body.hostId);
  let newImagePath = xss(req.body.imagePath)

  let errors = [];
  if (!verify.validString(id))  errors.push('Space id must be a valid string.');

  if (!verify.validString(newName))  errors.push('Space name must be a valid string.');

  if (!verify.validString(streetAddress))  errors.push('Street address must be a valid string.');
  if (!verify.validString(city))  errors.push('Space city must be a valid string.');
  if (!verify.validString(state))  errors.push('Space state must be a valid string.');
  if (!verify.validZip(zip))  errors.push('Space zip must be a valid string.');

  if (!verify.validNumber(length)) errors.push('Length must be a number');
  if (!verify.validNumber(width))  errors.push('Width must be a number');
  if (!verify.validNumber(height))  errors.push('Length must be a number');

  if (!verify.validNumber(newPrice)) errors.push('Length must be a number');
  if (!verify.validString(newHostId))  errors.push('Host id must be a valid string.');
  if(!verify.validString(newImagePath))  errors.push('Image Path must be valid string');

  // Do not submit if there are errors in the form
  if (errors.length > 0) {
      return res.status(400).json(errors);
  }

  try {
      const newSpace = await spaceData.updateSpace(id,newName, newAddress, newSpaceDim, newPrice,newHostId,newImagePath);
      return res.json(newSpace);
  } catch(e) {
      res.status(500).json({error: e});
  }
});

router.post('/remove/:id',async(req,res) => {
  if (!req.params.id) {
		res.status(400).json({ error: 'You must Supply an ID to delete' });
		return;
	}
	
	try {
   let deleteSpace = await spaceData.removeSpace(req.params.id);
    if(deleteSpace){
      res.status(200).json(deleteSpace);
      // return res.redirect("/restaurants/" + req.params.restaurantId);
    } else {
      return res.status(404).send();
    }
		//res.json({deleted: true, data: toBeDeletedReview});
	} catch (e) {
		res.status(500).json({ error: e });
	}

});


    module.exports = router