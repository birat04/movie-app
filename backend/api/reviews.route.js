import express from "express";
import ReviewsCtrl from "./reviews.controller.js";
import ReviewsDAO from "../review/reviews.js"; 


async function authorizeReview(req, res, next) {
  const { user } = req.body;
  const reviewId = req.params.id;
  const review = await ReviewsDAO.getReview(reviewId);

  if (!review) {
    return res.status(404).json({ error: "Review not found" });
  }

  if (review.user !== user) {
    return res.status(403).json({ error: "You are not authorized to perform this action" });
  }

  next(); 
}

const router = express.Router();


router.route("/movie/:id").get(ReviewsCtrl.apiGetReviews);
router.route("/new").post(ReviewsCtrl.apiPostReview);
router.route("/:id")
  .get(ReviewsCtrl.apiGetReview)
  .put(authorizeReview, ReviewsCtrl.apiUpdateReview)
  .delete(authorizeReview, ReviewsCtrl.apiDeleteReview);

export default router;
