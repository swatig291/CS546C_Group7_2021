const express = require('express');
const router = express.Router();
const data = require('../data');
const reviewData = data.reviews;
const spaceData = data.space;
const verify = data.util;
const xss = require('xss');
const { space } = require('../data');

router.post('/creatreview/:id', async function(req, res){
    if(!req.session.email){
        res.status(400).redirect('/user/login');
        return;
    }
    let errors = [];
    const spaceId = req.params.id;
    console.log(spaceId);
    const userId = req.session.userId;
    const review = xss(req.body.review);
    const rating = Number(xss(req.body.rating));
    let sumRating = 0;
    sumRating = Number(sumRating);
    if (!review){
        errors.push('Review can not be empty!')
    }
    if (!rating){
        errors.push('Rating can not be empty!')
    }
    if (!verify.validString(userId)){
        errors.push('Invaild userId!')
    }
    if (!verify.validString(spaceId)){
        errors.push('Invaild spaceId!')
    }
    if (!verify.validString(review)){
        errors.push('Invaild review!')
    }
    if (!verify.validRating(rating)){
        errors.push('Invaild rating!')
    }
    if (errors.length > 0) {
        return res.render('home/space', {errors: errors, hasError: true});
    }
    try {
        let reviewList = await reviewData.getAllreviewsOfSpace(spaceId);
        for(i in reviewList){
            sumRating += reviewList[i].rating;
        }
        let newSumRating = sumRating + rating;
        let avgRating = Math.round((newSumRating / (reviewList.length + 1)) * 10) / 10;
        const newSpace = await spaceData.updateSpaceRating(spaceId,avgRating);
        const newreview = await reviewData.createreview(userId, spaceId, review, rating);
        res.redirect('http://localhost:3000/space/' + spaceId);
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
    let reviewId = xss(req.params.id);
    let errors = [];
    if (!verify.validString(reviewId)){
        errors.push('Invaild reviewId!')
    }
    if(errors.length > 0) {
        return res.status(400).json(errors);
    }
    try{
        let sumRating = 0;
        sumRating = Number(sumRating);
        let thisReview = await reviewData.getreviewById(reviewId);
        let reviewList = await reviewData.getAllreviewsOfSpace(thisReview.spaceId.toString())
        for(i in reviewList){
            sumRating += reviewList[i].rating
        }
        let newSumRating = sumRating - thisReview.rating;
        let avgRating = Math.round((newSumRating / (reviewList.length - 1)) * 10) / 10;
        let space = await spaceData.getSpaceById(thisReview.spaceId.toString())
        if(reviewList.length == 1){
            avgRating = 0;
        }
        const newSpace = await spaceData.updateSpaceRating(space._id,avgRating);
        let deletereview = await reviewData.deletereview(reviewId);
        if(deletereview){
            res.redirect('http://localhost:3000/space/' + thisReview.spaceId);
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
    const rating = Number(xss(req.body.rating));
    let errors = [];
    if(!verify.validString(review)){
        errors.push('Invaild review!')
    }
    if (!verify.validRating(rating)){
        errors.push('Invaild rating!')
    }
    if(errors.length > 0) {
        return res.status(400).json(errors);
    }
    try {
        let sumRating = 0;
        sumRating = Number(sumRating);
        let thisReview = await reviewData.getreviewById(id);
        let reviewList = await reviewData.getAllreviewsOfSpace(thisReview.spaceId.toString())
        for(i in reviewList){
            sumRating += reviewList[i].rating
        }
        let newSumRating = sumRating - thisReview.rating + rating;
        let avgRating = Math.round((newSumRating / reviewList.length) * 10) / 10;
        let space = await spaceData.getSpaceById(thisReview.spaceId.toString())
        const newSpace = await spaceData.updateSpaceRating(space._id,avgRating);
        const newreview = await reviewData.updatereview(id, review, rating);
        res.redirect('/space');
    } catch(e) {
        if(e == 'Nothing to change')
        {
            errors.push(e);
            res.redirect('/space');
        }
        res.status(500).json({error: e});
    }
});

module.exports = router;