const express = require('express');
const router = express.Router();
const data = require('../data');
const spaceData = data.space;
const commentData = data.comments;
const reviewData = data.reviews;
const bookingData = data.bookings;

const userData = data.users;
const verify = data.util;
const xss = require('xss');
const path = require("path");
const formidable = require('formidable');
const fs = require('fs');

//Create a space
router.post('/add', async (req, res) => {
  if(!req.session.email)
  {
    res.status(400).redirect('/user/login');
    return;
  }
  let errors = [];
    var form = new formidable.IncomingForm();
    const uploadFldr = path.join(__dirname, '../','public/','images/','uploads/')
    try {
      if (!fs.existsSync(uploadFldr)) {
           fs.mkdirSync(uploadFldr)
      }
    } catch (err) {
      errors.push(err);
    }
    const folderName = path.join(__dirname, '../','public/','images/','uploads/','temp/');
   
    try {
      if (!fs.existsSync(folderName)) {
           fs.mkdirSync(folderName)
      }
    } catch (err) {
      errors.push(err);
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

          let location = {};    
           location['longitude'] = xss(fields.longitude);
           location['latitude'] = xss(fields.latitude);
          // let newImagePath = xss(req.body.imagePath)

         
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

          if (!verify.validLocation(location.longitude)) errors.push('longitude must be a number');
          if (!verify.validLocation(location.latitude)) errors.push('latitude must be a number');
          // if(!verify.validString(newImagePath))  errors.push('Image Path must be valid string');
         
          const allSpace = await spaceData.getAllSpace();
          for (let x of allSpace) {
            //city, state and zip can be same for multiple adress so comparing only street adress.
              if (x.address.streetAddress.toLowerCase() === newAddress.streetAddress.toLowerCase()) errors.push('A space with this address already exists.');
          }
          // Do not submit if there are errors in the form
          if (errors.length > 0) {
              //delete the uploaded photo's
              try{
                  if (fs.existsSync(folderName)) {
                    fs.rmSync(folderName, {recursive: true})
                  }
              }
              catch(e)
              {
                errors.push('error while uploading image');
              }
              // return res.status(400).json({errors,hasErrors});
              res.status(400).json ({
                errors: errors,
                 hasErrors : true,
                 fields: fields
                                
               });
             return;  
          }

          try {
              newSpace = await spaceData.createSpace(newName, newAddress, newSpaceDim, newPrice,newHostId,newDesc,location);
              //console.log(newSpace);
              let id = newSpace._id.toString();
              let folderNameNew = path.join(folderName,'../',id);
              fs.renameSync(folderName, folderNameNew)
              // return res.redirect('/space/'+id);
              return res.json({newSpace});

          } catch(e) {
              res.status(500).render('users/error', {error: e});
          }
  })
  

}
catch (error) {
  res.status(404).send(error);
}
 
    
});
//Redirecting to hosting space page
router.get('/host',async(req,res) =>{
    if(!req.session.email)
    {
      res.status(400).redirect('/user/login');
      return;
    }
  res.render('home/hostSpace');  
});

//editing the space on edit click button
router.get('/host/:id',async(req,res) =>{
  if(!req.session.email)
  {
    res.status(400).redirect('/user/login');
    return;
  }
  let errors = [];
  let id = xss(req.params.id);

  if (!verify.validString(id))  errors.push('Space id must be a valid string.');
  if (!verify.validId(id))  errors.push('Space id must be a valid string.');

  try{
    let spaceDetails = await spaceData.getSpaceById(req.params.id);
     if(spaceDetails !== null){
      res.status(200).render('home/editSPace', { spaceDetails});          
     }else {
      return res.status(404).send();
    }
  }
  catch(e){
    res.status(500).render('users/error', { error: e });
  }

});

//Loading all the spaces data for landing page
router.get("/", async (req, res) => {
  if(!req.session.email)
  {
    res.status(400).redirect('/user/login');
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
    res.status(500).send();
  }  
});

//Updating the space data
router.post('/edit', async (req, res) => {
  if(!req.session.email)
  {
    res.status(400).redirect('/user/login');
    return;
  }
    var form = new formidable.IncomingForm();
    
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
          
          let id = xss(fields.id);
          let newPrice = xss(fields.price);
          let newHostId = xss(req.session.userId);
          let newName = xss(fields.spaceName);
          let newDesc = xss(fields.description);
          let location = {};    
           location['longitude'] = xss(fields.longitude);
           location['latitude'] = xss(fields.latitude);

          let errors = [];
          if (!verify.validString(id))  errors.push('Space name must be a valid string.');
          if (!verify.validId(id))  errors.push('Space name must be a valid string.');
    
          if (!verify.validString(newDesc))  errors.push('Space name must be a valid string.');

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
         
          // const allSpace = await spaceData.getAllSpace();
          // for (let x of allSpace) {
          //   //city, state and zip can be same for multiple adress so comparing only street adress.
          //     if (x.address.streetAddress.toLowerCase() === newAddress.streetAddress.toLowerCase()) errors.push('A space with this address already exists.');
          // }
          // Do not submit if there are errors in the form
          if (errors.length > 0) {
            res.status(400).json ({
              errors: errors,
               hasErrors : true,
               fields: fields
                              
             });
          }
          try {
            const newSpace = await spaceData.updateSpace(id,newName, newAddress, newSpaceDim, newPrice,newHostId,newDesc,location);
            return res.redirect('/space/'+id);
        } catch(e) {
            res.status(500).render('users/error', {error: e});
        }
      
          // try {
          //      newSpace = await spaceData.createSpace(newName, newAddress, newSpaceDim, newPrice,newHostId,newDesc);
          //      let id = newSpace._id.toString();
          //      let folderNameNew = path.join(folderName,'../',id);
          //      fs.renameSync(folderName, folderNameNew)
          //      return res.json(newSpace);

          // } catch(e) {
          //     res.status(500).json({error: e});
          // }
  })
  

}
catch (error) {
  res.status(404).send(error);
}
});

//deleting the space
router.get('/remove/:id',async(req,res) => {
  if(!req.session.email)
  {
    res.status(400).redirect('/user/login');
    return;
  }
  if (!req.params.id) {
		res.status(400).json({ error: 'You must Supply an ID to delete' });
		return;
	}
	
	try {
   let deleteSpace = await spaceData.removeSpace(req.params.id);
    if(deleteSpace){
      // res.status(200).json(deleteSpace);
     
       return res.status(200).redirect("/user/action");
    } else {
      return res.status(404).send();
    }
		//res.json({deleted: true, data: toBeDeletedReview});
	} catch (e) {
		res.status(500).render('users/error', { error: e });
	}

});

//Search functionality
router.post("/search", async (req, res) => {
  if(!req.session.email)
  {
    res.status(400).redirect('/user/login');
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
    res.status(404).send();
  }  
});

//Get all the data related space by Id
router.get('/:id',async(req,res) =>{
  if(!req.session.email){
    res.status(400).redirect('/user/login');
    return;
  }
  if (!req.params.id) {
		res.status(400).json({ error: 'You must Supply an ID to search' });
		return;
	}
  let errors = [];
    try{
      let spaceDetails = await spaceData.getSpaceById(req.params.id);
       if(spaceDetails !== null){
        //  let reviews = await reviewData.getAllReviewsOfspace(req.params.id);

        let reviewList = await reviewData.getAllreviewsOfSpace(req.params.id);

        var bookings = new Array();
        try
        { 
          let bookingList = await bookingData.getAllbookingsBySpaceId(spaceDetails._id);
          if(bookingList !== null){
            for(let i = 0; i < bookingList.length ; i++)
            {
              bookings[i] = new Array();
              
                bookings[i][0]= bookingList[i].startDate;
                bookings[i][1]= bookingList[i].endDate;
              
            }
          }
        }
        catch(e)
        {
          errors.push('There are no bookings for this space');
        }
        
        let commentList =  await commentData.getAllCommentsOfSpace(spaceDetails._id);
        if(commentList !== null){
          for(i in commentList){
            let user = await userData.getUser(commentList[i].userId.toString())
            commentList[i].userName = user.firstName + " " +user.lastName;
            if(commentList[i].userId == req.session.userId){
              commentList[i].sameUser = true;
            }
          }
        }

        if(reviewList !== null){
          for(i in reviewList){
            let user = await userData.getUser(reviewList[i].userId.toString())
            reviewList[i].userName = user.firstName + " " +user.lastName;
            if(reviewList[i].userId == req.session.userId){
              reviewList[i].sameUser = true;
            }
          }
       }

        let folder  = path.join(__dirname, '../','public/','images/','uploads/',spaceDetails._id);
        spaceDetails['photoArray'] = [];
        if (fs.existsSync(folder)) {
          fs.readdirSync(folder).forEach(file => {
            let imgPath = 'http://localhost:3000/public/images/uploads/' + spaceDetails._id + '/'+ file;
            spaceDetails.photoArray.push(imgPath);
            });
          }

         //Avoid host from booking the space he hosted.
         let canBook = true;
         if(req.session.userId === spaceDetails.hostId)
         {
           canBook = false;
         }
        return res.status(200).render('home/space', { spaceDetails,commentList,reviewList, canBook,booking : JSON.stringify(bookings)});          
       }else {
        return res.status(404).send();
      }
    }
    catch(e){
      res.status(500).render('users/error', { error: e });
    }
});

//get All spaces hosted by userId
router.get('/user/action', async (req, res) => {
  if(!req.session.email)
  {
    res.status(400).redirect('/user/login');
    return;
  }
  try {
    let spaceList = await spaceData.getAllSpaceByUserID(req.session.userId);
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
    res.render('home/userSpace', { spaceList});
    // res.status(200).json(spaceList);
  } catch (e) {
    // Something went wrong with the server!
    console.log(e);
    res.status(404).send();
  }  
});

//Filter space data based on dropdown filter
router.get('/filter/:filterBy',async(req,res) =>{
  let errors = [];
  if(!req.session.email)
  {
    res.status(400).redirect('/user/login');
    return;
  }
  let param = xss(req.params.filterBy);
  if (!verify.validString(param))  errors.push('Filter value must be valid string');
  if (!param) {
    errors.push('You must select a value to filter');
		return;
	}
  if (errors.length > 0) {
    return res.status(400).json(errors);
  }
    try{
      var spaceList = await spaceData.filterSpace(param)
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
    }catch(e){

    }
});

module.exports = router