import React, { useEffect, useState } from "react";

const UserReviews = ({ userId }) => {
  const [reviews, setReviews] = useState([]);

  useEffect(() => {
    const fetchUserReviews = async () => {
      const response = await fetch(`http://localhost:3000/api/users/${userId}/reviews`);
      const data = await response.json();
      setReviews(data);
    };

    fetchUserReviews();
  }, [userId]);

  return (
    <div>
      <h2>User Reviews</h2>
      {reviews.map(review => (
        <div key={review.id}>{review.title}</div>
      ))}
    </div>
  );
};

export default UserReviews;
