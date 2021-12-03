 const express = require('express');
const router = express.Router();
const data = require('../data');
const spaceData = data.space;
const reviewData = data.reviews;
const verify = data.util;
const xss = require('xss');
const path = require("path");
const formidable = require('formidable');
const fs = require('fs')



router.post('/add', async (req, res) => {
  if(!req.session.email)
  {
    res.status(400).redirect('/login');
    return;
  }
    var form = new formidable.IncomingForm();
    const folderName = path.join(__dirname, '../','public/','images/','uploads/','temp/');
    try {
      if (!fs.existsSync(folderName)) {
           fs.mkdirSync(folderName)
      }
    } catch (err) {
      console.error(err)
    }

    form.uploadDir = folderName;
    form.keepExtensions = true;
    // form.parse(req);
    try {
    form.parse(req,async (err, fields, files) => {  
      
          const newAddress = {};
          newAddress['streetAddress'] = xss(fields.streetAddress);
          newAddress['city'] = xss(fields.city);
          newAddress['state'] = xss(fields.state);
          newAddress['zip'] = xss(fields.zip);

          let newSpaceDim = {};
          newSpaceDim['length'] = xss(fields.length);
          newSpaceDim['width'] = xss(fields.width);
          newSpaceDim['height'] = xss(fields.height);

          let newPrice = xss(fields.price);
          let newHostId = xss(req.session.userId);
          let newName = xss(fields.spaceName);
          let newDesc = xss(fields.description);
          // let newImagePath = xss(req.body.imagePath)

          let errors = [];
          if (!verify.validString(newName))  errors.push('Space name must be a valid string.');

          if (!verify.validString(newAddress.streetAddress))  errors.push('Street address must be a valid string.');
          if (!verify.validString(newAddress.city))  errors.push('Space city must be a valid string.');
          if (!verify.validString(newAddress.state))  errors.push('Space state must be a valid string.');
          if (!verify.validZip(newAddress.zip))  errors.push('Space zip must be a valid string.');

          if (!verify.validNumber(newSpaceDim.length)) errors.push('Length must be a number');
          if (!verify.validNumber(newSpaceDim.width))  errors.push('Width must be a number');
          if (!verify.validNumber(newSpaceDim.height))  errors.push('Length must be a number');

          if (!verify.validNumber(newPrice)) errors.push('Length must be a number');
          if (!verify.validString(newHostId))  errors.push('Host id must be a valid string.');
          // if(!verify.validString(newImagePath))  errors.push('Image Path must be valid string');
         
          const allSpace = await spaceData.getAllSpace();
          for (let x of allSpace) {
            //city, state and zip can be same for multiple adress so comparing only street adress.
              if (x.address.streetAddress.toLowerCase() === newAddress.streetAddress.toLowerCase()) errors.push('A space with this address already exists.');
          }
          // Do not submit if there are errors in the form
          if (errors.length > 0) {
              return res.status(400).json(errors);
          }

          try {
               newSpace = await spaceData.createSpace(newName, newAddress, newSpaceDim, newPrice,newHostId,newDesc);
               let id = newSpace._id.toString();
               let folderNameNew = path.join(folderName,'../',id);
               fs.renameSync(folderName, folderNameNew)
               return res.json(newSpace);

          } catch(e) {
              res.status(500).json({error: e});
          }
  })
  

}
catch (error) {
  res.status(404).send(error);
}
 
    
});

  router.get('/host',async(req,res) =>{
    if(!req.session.email)
    {
      res.status(400).redirect('/login');
      return;
    }
  res.render('home/hostSpace');  

});

router.get("/", async (req, res) => {
  if(!req.session.email)
  {
    res.status(400).redirect('/login');
    return;
  }
  try {
    let spaceList = await spaceData.getAllSpace();
    spaceList.forEach(space => {
      let folder  = path.join(__dirname, '../','public/','images/','uploads/',space._id);
      space['photoArray'] = [];
      if (fs.existsSync(folder)) {
        fs.readdirSync(folder).forEach(file => {
          let imgPath = 'http://localhost:3000/public/images/uploads/' + space._id + '/'+ file;
          space.photoArray.push(imgPath);
         });
       }
      
    })
    res.render('home/landing', { spaceList});
    // res.status(200).json(spaceList);
  } catch (e) {
    // Something went wrong with the server!
    console.log(e);
    res.status(404).send();
  }  
});

router.post('/edit', async (req, res) => {
  if(!req.session.email)
  {
    res.status(400).redirect('/login');
    return;
  }
  
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
  if(!req.session.email)
  {
    res.status(400).redirect('/login');
    return;
  }
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

router.post("/search", async (req, res) => {
  if(!req.session.email)
  {
    res.status(400).redirect('/login');
    return;
  }
  let errors = [];
  let search = req.body.name;
  try {
    if (!search.trim()) {
      res.status(400).json({ error: 'You must Supply an location  to search' });
      return;
    }
    if (!verify.validString(search.trim()))  errors.push('loaction must be a valid string.');
    let spaceList = await spaceData.getSpaceSearch(search.trim());
    if(spaceList !== null)
    {
    spaceList.forEach(space => {
      let folder  = path.join(__dirname, '../','public/','images/','uploads/',space._id);
      space['photoArray'] = [];
      if (fs.existsSync(folder)) {
        fs.readdirSync(folder).forEach(file => {
          let imgPath = 'http://localhost:3000/public/images/uploads/' + space._id + '/'+ file;
          space.photoArray.push(imgPath);
         });
       }
    })
  }
    res.status(200).render('home/landing', { spaceList});
  } catch (e) {
    // Something went wrong with the server!
    console.log(e);
    res.status(404).send();
  }  
});

router.get('/:id',async(req,res) =>{
  if(!req.session.email)
  {
    res.status(400).redirect('/login');
    return;
  }
  if (!req.params.id) {
		res.status(400).json({ error: 'You must Supply an ID to delete' });
		return;
	}
    try{
      let spaceDetails = await spaceData.getSpaceById(req.params.id);
       if(spaceDetails !== null)
       {
        //  let reviews = await reviewData.getAllReviewsOfspace(req.params.id);
        //  let comments = await commentData.getAllCommentsOfSpace(req.params.id);
        
          let folder  = path.join(__dirname, '../','public/','images/','uploads/',spaceDetails._id);
          spaceDetails['photoArray'] = [];
          if (fs.existsSync(folder)) {
            fs.readdirSync(folder).forEach(file => {
              let imgPath = 'http://localhost:3000/public/images/uploads/' + spaceDetails._id + '/'+ file;
              spaceDetails.photoArray.push(imgPath);
             });
           }
         res.status(200).render('home/space', { spaceDetails});          
       }else {
        return res.status(404).send();
      }
    }
    catch(e){
      res.status(500).json({ error: e });
    }
});

    module.exports = router