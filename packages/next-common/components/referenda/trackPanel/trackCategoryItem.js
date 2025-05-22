import React from "react";
import { isNil } from "lodash-es";
import TrackTooltip from "./trackTooltip";
import Link from "next/link";

function TrackCategoryItem({ item }) {
  return (
    <TrackTooltip trackId={item.id} activeCount={item.activeCount}>
      <span className="leading-4 px-2 py-[2px] bg-neutral200 rounded-[8px]">
        <Link
          href={item.path}
          className="hover:underline hover:decoration-neutral500"
          onClick={(e) => {
            e.stopPropagation();
          }}
        >
          {item.name}
        </Link>
      </span>

      {!isNil(item.activeCount) && item.activeCount > 0 && (
        <span>
          <span className="px-2 text-textTertiary">·</span>
          <span className="text-textTertiary">{item.activeCount}</span>
        </span>
      )}
    </TrackTooltip>
  );
}
export default React.memo(TrackCategoryItem);
