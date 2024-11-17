const express = require("express");
const router = express.Router();
const { isLoggedIn } = require("./utils");
const {
  createReview,
  fetchReviews,
  getUsersReviews,
  getBusinessReviews,
  deleteReview,
} = require("../db/review");

// Public: Fetch reviews by a specific user
router.get("/users/:id/reviews", async (req, res) => {
  const userId = req.params.id;
  try {
    const reviews = await getUsersReviews(userId);
    res.json(reviews);
  } catch (error) {
    console.error("Error fetching user's reviews:", error); // Log the error
    res.status(500).json({ error: "Failed to fetch user's reviews" });
  }
});

// Public: Fetch reviews for a specific business
router.get("/businesses/:id/reviews", async (req, res) => {
  const businessId = req.params.id;
  try {
    const reviews = await getBusinessReviews(businessId);
    res.json(reviews);
  } catch (error) {
    res.status(500).json({ error: "Failed to fetch business reviews" });
  }
});

// Protected: Create a review for a specific business
router.post("/businesses/:id/reviews", isLoggedIn, async (req, res) => {
  const businessId = req.params.id;
  const userId = req.user.id;
  const { title, description, rating } = req.body;

  try {
    const review = await createReview({
      title,
      description,
      user_id: userId,
      business_id: businessId,
      rating,
    });
    res.status(201).json(review);
  } catch (error) {
    res.status(500).json({ error: "Failed to create review" });
  }
});

// Protected: Delete a review by its ID
router.delete("/reviews/:id", isLoggedIn, async (req, res) => {
  const reviewId = req.params.id;
  const userId = req.user.id;

  try {
    const review = await fetchReviews(); // Assume fetchReviews includes user_id of each review
    const reviewToDelete = review.find(
      (r) => r.id === reviewId && r.user_id === userId
    );

    if (!reviewToDelete) {
      return res
        .status(403)
        .json({ error: "You do not have permission to delete this review." });
    }

    const deletedReview = await deleteReview(reviewId);
    res.json(deletedReview);
  } catch (error) {
    res.status(500).json({ error: "Failed to delete review" });
  }
});

module.exports = router;
