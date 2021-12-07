const express = require('express');
const router = express.Router();
const data = require('../data');
const reviewData = data.reviews;
const verify = data.util;
const xss = require('xss');

router.post('/creatreview/:id', async function(req, res){
    if(!req.session.AuthCookie){
      res.status(401).redirect("/user/login")
    }
    errors = [];
    const spaceId = req.params.id;
    const userId = req.session.userId;
    const review = xss(req.body.review);
    const rating = xss(req.body.rating);
    if (!verify.validString(userId)){
        errors.push('Invaild userId!')
    }
    if (!verify.validString(spaceId)){
        errors.push('Invaild spaceId!')
    }
    if (!verify.validString(review)){
        errors.push('Invaild review!')
    }
    if (errors.length > 0) {
        return res.status(400).json(errors);
    }
    try {
        //let userDetails = await userData.getUser(req.session.userId);
        const newreview = await reviewData.createreview(userId, spaceId, review,rating);
        return res.render('home/space', {newreview});
    } catch(e) {
        res.status(500).json({error: e});
    }
});

router.get("/:id",async function(req,res){
    if(!req.session.email){
        res.status(400).redirect('/user/login');
        return;
    }
    let errors = [];
    if(!req.params.id.trim()){
        res.status(400).json({ error: 'You must Supply an Id' });
        return;
    }
    if(!verify.validString(req.params.id.trim())){
        errors.push('Invalid Id!');
    }
    if(errors.length > 0) {
        return res.status(400).json(errors);
    }
    try{
        let review = await reviewData.getreviewById(req.params.id);
        res.status(200).json(review);
    }
    catch(e){
        res.status(500).json({error: e});
    }
});

router.get("/space/:id",async function(req,res){
    if(!req.session.email){
        res.status(400).redirect('/user/login');
        return;
    }
    let spaceId = xss(req.params.id);

    let errors = [];
    if (!verify.validString(spaceId)){
        errors.push('Invaild spaceId!')
    }
    if(errors.length > 0) {
        return res.status(400).json(errors);
    }
    try{
        const reviewList = await reviewData.getAllreviewsOfSpace(spaceId);
        res.status(200).json(reviewList);
    }
    catch(e){
        res.status(500).json({error: e});
    }
});

router.get("/user/:id",async function(req,res){
    if(!req.session.email){
        res.status(400).redirect('/user/login');
        return;
    }
    let userId = xss(req.params.id)
    let errors = [];
    if (!verify.validString(userId)){
        errors.push('Invaild userId!')
    }
    if(errors.length > 0){
        return res.status(400).json(errors);
    }
    try{
        const reviewList = await reviewData.getAllreviewsOfUser(userId);
        res.status(200).json(reviewList);
    }
    catch(e){
        res.status(500).json({error: e});
    }
});

router.post('/delete/:id',async function(req,res){
    if(!req.session.email){
        res.status(400).redirect('/user/login');
        return;
    }
    if(!req.params.id) {
        res.status(400).json({ error:'You must Supply an ID!' });
        return;
    }
    let reviewId = xss(req.params.id)
    let errors = [];
    if (!verify.validString(reviewId)){
        errors.push('Invaild reviewId!')
    }
    if(errors.length > 0) {
        return res.status(400).json(errors);
    }
    try{
        let deletereview = await reviewData.deletereview(reviewId);
        if(deletereview){
            res.redirect('/space');
        }else{
            return res.status(404).send();
        }
    } 
    catch(e){
        res.status(500).json({ error: e });
    }
});

router.post('/edit/:id', async function(req, res){
    if(!req.session.email){
        res.status(400).redirect('/user/login');
        return;
    }
    const id = req.params.id;
    const review = xss(req.body.review);
    const rating = xss(req.body.rating);
    errors = [];
    console.log(review)
    if(!verify.validString(review)){
        throw 'Invaild review22!'
    }
    if(errors.length > 0){
        return res.status(400).json(errors);
    }
    try {
        const newreview = await reviewData.updatereview(id, review,rating);
        res.redirect('/space');
    } catch(e) {
        res.status(500).json({error: e});
    }
});

module.exports = router;