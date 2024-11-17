import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";

const UserDetail = ({ auth }) => {
  const { id: userId } = useParams();
  const [reviews, setReviews] = useState([]);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchUserReviews = async () => {
      try {
        const response = await fetch(`http://localhost:3000/api/reviews/users/${userId}/reviews`);
        if (!response.ok) throw new Error("Failed to fetch user reviews");
        const data = await response.json();
        setReviews(data);
      } catch (err) {
        setError(err.message);
      }
    };
    fetchUserReviews();
  }, [userId]);

  const deleteReview = async (reviewId) => {
    
    try {
      const response = await fetch(`http://localhost:3000/api/reviews/${reviewId}`, {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${auth.token}`,
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
      <h1>User Reviews</h1>
      {error ? (
        <p>Error: {error}</p>
      ) : reviews.length > 0 ? (
        reviews.map((review) => (
          <div key={review.id} style={{ border: "1px solid #ddd", padding: "10px", margin: "10px" }}>
            <h2>Review of {review.business_name}</h2>
            <p>Rating: {review.rating}</p>
            <p>{review.description}</p>
            {auth && auth.id === review.user_id && (
              <button onClick={() => deleteReview(review.id)}>Delete</button>
            )}
          </div>
        ))
      ) : (
        <p>No reviews found.</p>
      )}
    </div>
  );
};

export default UserDetail;
