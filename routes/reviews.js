const express = require('express');
const router = express.Router();
const data = require("../data");
const reviewData = data.reviews;




//get all reviews by Space ID
router.get("/:id", async function (req, res) {
    if(!req.session.email)
    {
      res.status(400).redirect('/login');
      return;
    }
    try {
        const reviewInfo = await reviewData.getAllReviewsBySpaceId(req.params.id); // 
        // console.log(req.params.id)
        res.json(reviewInfo);
    }
    catch (e) {
        res.status(404).json({ message: "'review' item not found!" });
    }
});


//get review by review ID
router.get("/:id", async function (req, res) {
    try {
        const reviewInfo = await reviewData.getReviewById(req.params.id); // title, user(id), post(id), content, time
        // console.log(req.params.id)
        res.json(reviewInfo);
    }
    catch (e) {
        res.status(404).json({ message: "'review' item not found!" });
    }
});

//get all reviews by User ID
router.get("/:id", async function (req, res) {
    try {
        const reviewInfo = await reviewData.getAllReviewsByUserId(req.params.id); // 
        // console.log(req.params.id)
        res.json(reviewInfo);
    }
    catch (e) {
        res.status(404).json({ message: "'review' item not found!" });
    }
});


//get reviews by space ID
// router.get('/space/:id', async (req, res) => {
//     let idInfo = req.params.id;
//     if (!idInfo) {
//         res.status(400).json({ error: 'You must provide id to get a space' });
//         return;
//     }
//     try {
//         const spaceById = await reviewData.getAllReviewsBySpaceId(idInfo);
//         res.json(spaceById);
//     } catch (error) {
//         // console.log(error);
//         res.status(404).json({ error: 'review not found' });
//     }
// });

router.get("/", async function (req, res) {
    if(!req.session.email)
  {
    res.status(400).redirect('/login');
    return;
  }
    try {
        const reviewList = await reviewData.getAllReviews();
        res.json(reviewList);
    }
    catch (e) {
        res.status(500).send();
    }
});

router.post("/", async (req, res) => { // add
    if(!req.session.email)
  {
    res.status(400).redirect('/login');
    return;
  }
    let reviewInfo = req.body;
    if (!reviewInfo) {
        res.status(400).json({ error: 'You must provide data to create a review' });
        return;
    }

    // const {title, user, space, content} = reviewInfo;
    const { spaceId, userId, content, rating, datetime } = reviewInfo;
    if (!spaceId || typeof spaceId !== 'string') {
        res.status(400).json({ error: 'You must provide a spaceId for the review' });
        return;
    }
    if (!userId) {
        res.status(400).json({ error: 'You must provide user id for the review' });
        return;
    }
  
    if (!content || typeof content !== 'string') {
        res.status(400).json({ error: 'review content can not be empty.' });
        return;
    }
    if (!rating || typeof rating !== 'number' ||rating > 5 || rating < 1) {
        res.status(400).json({ error: 'You must provide space review rating,and it must be a integer number between 1-5 ' });
        return;
    }
    try {
        // const newreview = await reviewData.addReview(title, user, space, content);
        const newreview = await reviewData.addReview( spaceId, userId, content, rating, datetime);
        res.status(200).send(newreview)
    } catch (e) {
        res.status(500).json({ error: e })
    }
});

router.post('/remove/:id', async (req, res) => {
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
        let deletereview = await reviewData.removeReview(req.params.id);
        if (deletereview) {
            res.status(200).json(deletereview);
            // return res.redirect("/spaces/" + req.params.spaceId);
        } else {
            return res.status(404).send();
        }
        //res.json({deleted: true, data: toBeDeletedReview});
    } catch (e) {
        res.status(500).json({ error: e });
    }

});

// this function should be added into "data/posts.js"
async function getListOfreviewsInPost(postId) {
    const thisPost = await post.getPost(postId);
    const listOfreviews = thisPost.reviews; // an array of IDs
    return listOfreviews;
}


module.exports = router;




