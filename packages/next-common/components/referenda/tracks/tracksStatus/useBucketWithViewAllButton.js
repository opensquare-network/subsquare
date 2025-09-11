import { useState } from "react";
import useBucket from "./useBucket";

export default function useBucketWithViewAllButton({
  sections,
  capacity,
  idleItemsColor,
  paddingItemsColor,
}) {
  const [viewAll, setViewAll] = useState(false);
  const {
    component: bucket,
    maxItemsCountInALine,
    currentItemsCount,
  } = useBucket({
    sections,
    capacity,
    expanded: viewAll,
    idleItemsColor,
    paddingItemsColor,
  });

  let viewAllBtn = null;
  if (currentItemsCount > maxItemsCountInALine) {
    viewAllBtn = (
      <span
        className="cursor-pointer text12Medium text-theme500"
        onClick={() => setViewAll(!viewAll)}
      >
        {viewAll ? "Hide" : "View All"}
      </span>
    );
  }

  return {
    bucket,
    viewAllBtn,
  };
}
