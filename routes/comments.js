const express = require('express');
const router = express.Router();
const data = require('../data');
const commentData = data.comments;
const verify = data.util;
const xss = require('xss');

router.post('/creatComment/:id', async function(req, res){
    if(!req.session.AuthCookie){
      res.status(401).redirect("/user/login")
    }
    errors = [];
    const spaceId = req.params.id;
    const userId = req.session._id;
    const comment = xss(req.body.comment);

    if (!verify.validString(userId)){
        errors.push('Invaild userId!')
    }
    if (!verify.validString(spaceId)){
        errors.push('Invaild spaceId!')
    }
    if (!verify.validString(comment)){
        errors.push('Invaild comment!')
    }
    if (errors.length > 0) {
        return res.status(400).json(errors);
    }
    try {
        //let userDetails = await userData.getUser(req.session._id);
        const newComment = await commentData.createComment(userId, spaceId, comment);
        return res.json(newComment);
    } catch(e) {
        res.status(500).json({error: e});
    }
});
router.get('/creatComment/:id', async function(req, res){
    if(!req.session.email){
      res.status(400).redirect('/user/login');
      return;
    }
    try{
        id = req.params.id
        res.render('comments/creat', {pageTitle: 'creatComment',spaceId: id});
    }catch(e){
        
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
        let comment = await commentData.getCommentById(req.params.id);
        res.status(200).json(comment);
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
        const commentList = await commentData.getAllCommentsOfSpace(spaceId);
        res.status(200).json(commentList);
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
        const commentList = await commentData.getAllCommentsOfUser(userId);
        res.status(200).json(commentList);
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
    let commentId = xss(req.params.id)
    let errors = [];
    if (!verify.validString(commentId)){
        errors.push('Invaild commentId!')
    }
    if(errors.length > 0) {
        return res.status(400).json(errors);
    }
    try{
        let deleteComment = await commentData.deleteComment(commentId);
        if(deleteComment){
            res.status(200).json(deleteComment);
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
    const comment = xss(req.body.comment);
    errors = [];
    console.log(comment)
    if(!verify.validString(comment)){
        throw 'Invaild comment22!'
    }
    if(errors.length > 0){
        return res.status(400).json(errors);
    }
    try {
        const newComment = await commentData.updateComment(id, comment);
        return res.json(newComment);
    } catch(e) {
        res.status(500).json({error: e});
    }
});
  
router.get('/edit/:id', async function(req, res){
    if(!req.session.email){
        res.status(400).redirect('/user/login');
        return;
    }
    try{
        id = req.params.id
        res.render('comments/edit', {pageTitle: 'editComment',commentId: id});
    }catch(e){
 
    }
});

module.exports = router;