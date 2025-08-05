// Example Badge component (can go in components/Badge.jsx)
import React from 'react';

// src/components/Badge.jsx
const Badge = ({ type, value }) => {
  let color = "gray";

  if (type === "urgency") {
    if (value === "high") color = "red";
    else if (value === "medium") color = "orange";
    else if (value === "low") color = "green";
  }

  if (type === "status") {
    if (value === "Pending") color = "gray";
    else if (value === "In Progress") color = "blue";
    else if (value === "Resolved") color = "green";
  }

  return (
    <span
      style={{
        backgroundColor: color,
        color: "white",
        padding: "2px 8px",
        borderRadius: "12px",
        fontSize: "0.75rem",
        textTransform: "capitalize"
      }}
    >
      {value}
    </span>
  );
};

export default Badge;
