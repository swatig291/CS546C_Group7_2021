const express = require('express');
const router = express.Router();
const data = require('../data');
const commentData = data.comments;
const verify = data.util;
const xss = require('xss');

router.post('/comment/add', async function(req, res) {
    if(!req.session.AuthCookie)
    {
      res.status(401).redirect("/login")
    }
    let errors = [];
    let userId = xss(req.body.userId);
    let spaceId = xss(req.body.spaceId);
    let comment = xss(req.body.comment);
    let date = xss(req.body.date);

    if (!verify.validString(userId)){
        errors.push('Invaild userId!')
    }
    if (!verify.validString(spaceId)){
        errors.push('Invaild spaceId!')
    }
    if (!verify.validString(comment)){
        errors.push('Invaild comment!')
    }
    if (!verify.validString(date)){
        errors.push('Invaild date!')
    }
    if (date.length !== 10 || date[2] !== '/' || date[5] !== '/') {
        errors.push("date is not vaild!")
    }
    const month = Number(date.substring(0,2));
    const day = Number(date.substring(3,5));
    const year = Number(date.substring(6)); 
    if(month < 1 || month > 12){
        errors.push("The month parameter is invalid!")
    }
    if( month === 1,3,5,7,8,10,12){
        if(day < 1 || day > 31){
            errors.push("The day parameter is invalid!")
        }
    }
    if( month === 2){
        if(year % 4 == 0 && year % 100 != 0 || year % 400 == 0){
            if(day < 1 || day > 29){
                errors.push("The day parameter is invalid!")
            }
        }
        else if(day < 1 || day > 28){
            errors.push("The day parameter is invalid!")
        }
    }
    if( month === 4,6,9,11){
        if(day < 1 || day > 30){
            errors.push("The day parameter is invalid!")
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
        errors.push("date is not vaild!")
    }
    if (errors.length > 0) {
        return res.status(400).json(errors);
    }
    try {
        const newComment = await commentData.createComment(userId, spaceId, comment, date);
        return res.json(newComment);
    } catch(e) {
        res.status(500).json({error: e});
    }
});

router.get("/comment/:id",async function(req,res) {
    if(!req.session.email)
  {
    res.status(400).redirect('/login');
    return;
  }
    let errors = [];
    if(!req.params.id.trim()) {
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
        let comment = await commentData.getCommentById(req.params.id);
        res.status(200).json(comment);
    }
    catch(e){
        res.status(500).json({error: e});
    }
});

router.get("/:spaceId",async function(req,res) {
    if(!req.session.email)
  {
    res.status(400).redirect('/login');
    return;
  }
    let spaceId = xss(req.params.spaceId)
    let errors = [];
    if (!verify.validString(spaceId)){
        errors.push('Invaild spaceId!')
    }
    if(errors.length > 0) {
        return res.status(400).json(errors);
    }
    try{
        const commentList = await commentData.getAllCommentsOfSpace(spaceId);
        res.status(200).json(commentList);
    }
    catch(e){
        res.status(500).json({error: e});
    }
});

router.get("/:userId",async function(req,res) {
    if(!req.session.email)
    {
      res.status(400).redirect('/login');
      return;
    }
    let userId = xss(req.params.userId)
    let errors = [];
    if (!verify.validString(userId)){
        errors.push('Invaild userId!')
    }
    if(errors.length > 0) {
        return res.status(400).json(errors);
    }
    try{
        const commentList = await commentData.getAllCommentsOfUser(userId);
        res.status(200).json(commentList);
    }
    catch(e){
        res.status(500).json({error: e});
    }
});

router.post('/delete/:commentId',async function(req,res) {
    if(!req.session.email)
    {
      res.status(400).redirect('/login');
      return;
    }
    if(!req.params.commentId) {
        res.status(400).json({ error:'You must Supply an ID!' });
        return;
    }
    try {
        let deleteComment = await commentData.deleteComment(req.params.commentId);
        if(deleteComment){
            res.status(200).json(deleteComment);
        }else {
            return res.status(404).send();
        }
    } 
    catch(e){
        res.status(500).json({ error: e });
    }
});

module.exports = router;