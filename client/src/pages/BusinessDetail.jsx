import React, { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";

const BusinessDetail = ({ auth }) => {
  const { id: businessId } = useParams();
  const [business, setBusiness] = useState(null);
  const [reviews, setReviews] = useState([]);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchBusinessData = async () => {
      try {
        const businessResponse = await fetch(`http://localhost:3000/api/businesses/${businessId}`);
        if (!businessResponse.ok) throw new Error("Failed to fetch business");
        const businessData = await businessResponse.json();
        setBusiness(businessData);

        const reviewsResponse = await fetch(`http://localhost:3000/api/reviews/businesses/${businessId}/reviews`);
        if (!reviewsResponse.ok) throw new Error("Failed to fetch reviews");
        const reviewsData = await reviewsResponse.json();
        setReviews(reviewsData);
      } catch (err) {
        setError(err.message);
      }
    };
    fetchBusinessData();
  }, [businessId]);

  const deleteReview = async (reviewId) => {
    const token = window.localStorage.getItem("token"); // Retrieve token directly from localStorage

    try {
      const response = await fetch(`http://localhost:3000/api/reviews/reviews/${reviewId}`, {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      if (response.ok) {
        setReviews(reviews.filter((review) => review.id !== reviewId));
      } else {
        console.error("Failed to delete review");
      }
    } catch (err) {
      console.error("Error:", err);
    }
  };

  return (
    <div>
      <h1>Business Details</h1>
      {error ? (
        <p>Error: {error}</p>
      ) : business ? (
        <>
          <h2>{business.businessname_full}</h2>
          <p>{business.description}</p>
          <h3>Reviews</h3>
          {reviews.map((review) => (
            <div key={review.id} style={{ border: "1px solid #ddd", padding: "10px", margin: "10px" }}>
              <p>Review by {review.username}</p>
              <p>Rating: {review.rating}</p>
              <p>{review.description}</p>
              {auth && auth.id === review.user_id && (
                <button onClick={() => deleteReview(review.id)}>Delete</button>
              )}
            </div>
          ))}
        </>
      ) : (
        <p>Loading...</p>
      )}
    </div>
  );
};

export default BusinessDetail;
