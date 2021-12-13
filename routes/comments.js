const express = require('express');
const router = express.Router();
const data = require('../data');
const commentData = data.comments;
const verify = data.util;
const xss = require('xss');


router.post('/creatComment/:id', async function(req, res){
    if(!req.session.email){
        res.status(400).redirect('/user/login');
        return;
    }
    let errors = [];
    const spaceId = req.params.id;
    const userId = req.session.userId;
    const comment = xss(req.body.comment);
    if (!comment){
        errors.push('Comment cannot be empty!')
    }
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
        const newComment = await commentData.createComment(userId, spaceId, comment);
        return res.redirect('http://localhost:3000/space/' + spaceId);
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
    if(!req.params.id){
        res.status(400).json({ error:'You must Supply an ID!' });
        return;
    }
    let errors = [];
    let commentId = xss(req.params.id)
    let comment = await commentData.getCommentById(commentId);
    let loggedUserId = comment.userId.toString();
    
    if(loggedUserId != req.session.userId){
        errors.push('You can not delete the comment post by other person!')
    }
    if(!verify.validString(commentId)){
        errors.push('Invaild commentId!')
    }
    if(errors.length > 0){
        return res.status(400).json(errors);
    }
    try{
        let deleteComment = await commentData.deleteComment(commentId);
        if(deleteComment){
            // res.redirect('/space');
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
    const commentId = xss(req.params.id);
    const comment = xss(req.body.comment);
    let comment1 = await commentData.getCommentById(commentId.trim());
    let loggedUserId = comment1.userId.toString();
    errors = [];
    if(loggedUserId != req.session.userId){
        errors.push('You can not edit the comment post by other person!')
    }
    console.log(comment)
    if(!verify.validString(comment)){
        throw 'Invaild comment!'
    }
    if(errors.length > 0){
        return res.status(400).json(errors);
    }
    try {
        let authentication = await commentData.updateComment(commentId.trim(), comment);
        if(authentication.commentModified == true) {
            res.redirect('/space');
        }else{
            res.status(500).render('/home/space', {pageTitle: 'error occured', hasError: true, error: 'Internal Server Error', isAuthenticated: false});
        }
    } catch(e) {
        if(e == 'Nothing to update')
        {
            errors.push(e);
            res.redirect('/space');
        }
        else 
            res.status(400).render('/home/space', {pageTitle: 'error occured', hasError: true, error: e, isAuthenticated: false});
    }
});



module.exports = router;