import React from "react";
import { cn } from "next-common/utils";
import { isNil } from "lodash-es";
import Tooltip from "next-common/components/tooltip";

function CardTitleLabel({ bountyIndex, title, className = "" }) {
  if (isNil(bountyIndex) || isNil(title)) return null;

  return (
    <Tooltip content={title} className="my-3">
      <span
        className={cn(
          "w-full line-clamp-1 text16Medium text-textPrimary",
          className,
        )}
      >
        {`#${bountyIndex}`}
        <span className="text-textTertiary">{" · "}</span>
        {title}
      </span>
    </Tooltip>
  );
}

export default React.memo(CardTitleLabel);
