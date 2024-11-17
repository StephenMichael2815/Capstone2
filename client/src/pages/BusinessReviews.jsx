import React, { useEffect, useState } from "react";

const BusinessReviews = ({ businessId }) => {
  const [reviews, setReviews] = useState([]);

  useEffect(() => {
    const fetchBusinessReviews = async () => {
      const response = await fetch(`http://localhost:3000/api/reviews/businesses/${businessId}/reviews`);
      const data = await response.json();
      setReviews(data);
    };

    fetchBusinessReviews();
  }, [businessId]);

  return (
    <div>
      <h2>Business Reviews</h2>
      {reviews.map(review => (
        <div key={review.id}>{review.title}</div>
      ))}
    </div>
  );
};

export default BusinessReviews;
