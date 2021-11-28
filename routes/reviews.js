const express = require('express');
const router = express.Router();
const data = require("../data");
const reviewData = data.reviews;


router.get("/:id",async function(req,res) {
    try{
        const reviewInfo = await reviewData.getReviewById(req.params.id); //
        // console.log(req.params.id)
        res.json(reviewInfo);
    }
    catch(e){
        res.status(404).json({message:"'review' item not found!"});
    }
});

router.get("/",async function(req,res) {
    try{
        const reviewList = await reviewData.getAllReviewsOfspace();
        res.json(reviewList);
    }
    catch(e){
        res.status(500).send();
    }
});

router.post("/", async(req, res) => { // add
    let reviewInfo = req.body;
    if (!reviewInfo) {
        res.status(400).json({ error: 'You must provide data to create a review' });
        return;
      }

    const {reviewerId, spaceId, reviewText} = reviewInfo;


    if (!reviewerId || typeof reviewerId !== 'string') {
        res.status(400).json({ error: 'You must provide a reviewerId(String) for the review' });
        return;
    }
    if (!spaceId) {
        res.status(400).json({ error: 'You must provide spaceId for the review' });
        return;
    }
  
    if (! reviewText || typeof  reviewText !== 'string') {
        res.status(400).json({ error: 'review content can not be empty.' });
        return;
    }

    try {
        const newreview = await reviewData.createReview(reviewerId, spaceId, reviewText);
        res.status(200).send(newreview)
    }catch(e){
        res.status(500).json({error:e})
    }
});

router.delete("/:id", async (req, res) => {
    try {
      await reviewData.getreview(req.params.id);
    } catch (e) {
      res.status(404).json({ error: "No review found" });
    }
    try {
      const msg = await reviewData.remove(req.params.id);
      res.status(200).send(msg)
    } catch (e) {
      res.status(500).json({ error: e });
    }
  });

  // this function should be added into "data/posts.js"
  async function getListOfreviewsInPost(postId){
    const thisPost = await post.getPost(postId);
    const listOfreviews = thisPost.reviews; // an array of IDs
    return listOfreviews;
  }


module.exports = router;




