import ReviewsDAO from "../review/reviews.js";

export default class ReviewsController {
  static async apiPostReview(req, res, next) {
    try {
      const { movieId, review, user } = req.body;
      await ReviewsDAO.addReview(movieId, user, review);
      res.json({ status: "success" });
    } catch (e) {
      res.status(500).json({ error: e.message });
    }
  }

  static async apiGetReview(req, res, next) {
    try {
      const { id } = req.params;
      const review = await ReviewsDAO.getReview(id);
      if (!review) {
        res.status(404).json({ error: "Not found" });
        return;
      }
      res.json(review);
    } catch (e) {
      res.status(500).json({ error: e });
    }
  }

  static async apiUpdateReview(req, res, next) {
    try {
      const { id } = req.params;
      const { review, user } = req.body;
      const reviewResponse = await ReviewsDAO.updateReview(id, user, review);
      if (reviewResponse.modifiedCount === 0) {
        throw new Error("Unable to update review");
      }
      res.json({ status: "success" });
    } catch (e) {
      res.status(500).json({ error: e.message });
    }
  }

  static async apiDeleteReview(req, res, next) {
    try {
      const { id } = req.params;
      await ReviewsDAO.deleteReview(id);
      res.json({ status: "success" });
    } catch (e) {
      res.status(500).json({ error: e.message });
    }
  }

  static async apiGetReviews(req, res, next) {
    try {
      const { id } = req.params;
      const reviews = await ReviewsDAO.getReviewsByMovieId(id);
      if (!reviews) {
        res.status(404).json({ error: "Not found" });
        return;
      }
      res.json(reviews);
    } catch (e) {
      res.status(500).json({ error: e });
    }
  }
}
