import TrackCategoryItem from "./trackCategoryItem";
import { startCase } from "lodash-es";
import React from "react";
import CategoryIcon from "./categoryIcon";

function NormalCategoryDisplay({ category, tracksDisplay }) {
  return (
    <div>
      <CategoryIcon category={category} />
      <p className="text14Bold text-textPrimary p-2">{startCase(category)}</p>
      <ul className="mb-3">
        {tracksDisplay?.[category].map((item, idx) => (
          <li key={idx} className="text12Medium text-textSecondary py-1.5">
            <TrackCategoryItem item={item} />
          </li>
        ))}
      </ul>
    </div>
  );
}

export default React.memo(NormalCategoryDisplay);
