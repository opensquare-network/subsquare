import TrackCategoryItem from "./trackCategoryItem";
import React from "react";

function OthersExceedingDisplay({ category, tracksDisplay }) {
  if (category !== "others") return null;

  const chunkSize = 8;
  const chunks = [];
  for (let i = 0; i < tracksDisplay[category].length; i += chunkSize) {
    chunks.push(tracksDisplay[category].slice(i, i + chunkSize));
  }

  return chunks.map((chunk, chunkIndex) => (
    <div key={`${chunk}-${chunkIndex}`}>
      <ul className="my-3">
        {chunk.map((item, idx) => (
          <li key={idx} className="text12Medium text-textSecondary py-1.5">
            <TrackCategoryItem item={item} />
          </li>
        ))}
      </ul>
    </div>
  ));
}

export default React.memo(OthersExceedingDisplay);
