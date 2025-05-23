import React from "react";
import { cn } from "next-common/utils";

function CardTitleLabel({ bountyIndex, title, className = "" }) {
  return (
    <span
      className={cn(
        "my-3 w-full  line-clamp-1 text16Medium text-textPrimary",
        className,
      )}
    >
      {`#${bountyIndex}`}
      <span className="text-textTertiary">{" · "}</span>
      {title}
    </span>
  );
}

export default React.memo(CardTitleLabel);
