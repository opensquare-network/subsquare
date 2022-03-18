import React from "react";

export default function Caret({ isGrey = false, size = 14, down = true }) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 14 14"
      fill="none"
      transform={`rotate(${down ? 0 : 180})`}
      xmlns="http://www.w3.org/2000/svg"
    >
      <path
        d="M10 6L7 9L4 6"
        stroke={isGrey ? "#9DA9BB" : "#1E2134"}
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}
