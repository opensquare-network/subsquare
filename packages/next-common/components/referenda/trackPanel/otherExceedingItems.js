import TrackCategoryItem from "./trackCategoryItem";
import React from "react";

function OthersExceedingItems({ category, trackList }) {
  if (category !== "others") return null;

  const items = trackList[category];

  return (
    <div className="w-full grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-2">
      {items.map((item, idx) => (
        <div key={idx} className="text12Medium text-textSecondary py-1.5 ">
          <TrackCategoryItem item={item} />
        </div>
      ))}
    </div>
  );
}

export default React.memo(OthersExceedingItems);
