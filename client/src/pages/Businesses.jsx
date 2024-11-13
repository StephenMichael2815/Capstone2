import React from "react";
import { Button } from "@mui/material";

const Business = ({ business, onReview }) => {
  return (
    <div className="business">
      <h2>{business.name}</h2>
      <p>{business.description}</p>
      <Button
        variant="contained"
        sx={{
          backgroundColor: "black",
          color: "#FFFFFF",
          "&:hover": {
            backgroundColor: "#ff00cc",
          },
        }}
        onClick={() => onReview(business.id)}
      >
        Review
      </Button>
    </div>
  );
};

export default Business;
