import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";

const CreateReview = ({ auth }) => {
  const [businesses, setBusinesses] = useState([]);
  const [selectedBusinessId, setSelectedBusinessId] = useState("");
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [rating, setRating] = useState(5);
  const navigate = useNavigate();

  useEffect(() => {
    // Fetch all businesses when the component mounts
    const fetchBusinesses = async () => {
      try {
        const response = await fetch("http://localhost:3000/api/businesses");
        if (response.ok) {
          const data = await response.json();
          setBusinesses(data);
          if (data.length > 0) setSelectedBusinessId(data[0].id); // Default to first business if available
        }
      } catch (err) {
        console.error("Error fetching businesses:", err);
      }
    };
    
    fetchBusinesses();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    const token = window.localStorage.getItem("token"); // Retrieve token directly from localStorage
    console.log("Token being sent:", token); // Log the token for debugging
    
    try {
      const response = await fetch(`http://localhost:3000/api/reviews/businesses/${selectedBusinessId}/reviews`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`, // Attach token with "Bearer" prefix
        },
        body: JSON.stringify({ title, description, rating }),
      });
      if (response.ok) {
        navigate(`/businesses/${selectedBusinessId}`);
      } else {
        console.error("Failed to create review:", response.statusText);
      }
    } catch (err) {
      console.error("Error:", err);
    }
  };
  

  return (
    <form onSubmit={handleSubmit}>
      <h1>Create Review</h1>
      
      {/* Dropdown for selecting a business */}
      <label>
        Select Business:
        <select
          value={selectedBusinessId}
          onChange={(e) => setSelectedBusinessId(e.target.value)}
          required
        >
          {businesses.map((business) => (
            <option key={business.id} value={business.id}>
              {business.businessname_full} {/* Display business name */}
            </option>
          ))}
        </select>
      </label>
      
      <input
        placeholder="Title"
        value={title}
        onChange={(e) => setTitle(e.target.value)}
        required
      />
      <textarea
        placeholder="Description"
        value={description}
        onChange={(e) => setDescription(e.target.value)}
        required
      />
      <input
        type="number"
        min="1"
        max="5"
        value={rating}
        onChange={(e) => setRating(e.target.value)}
        required
      />
      <button type="submit">Create Review</button>
    </form>
  );
};

export default CreateReview;
