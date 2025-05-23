import React from "react";
import { cn } from "next-common/utils";

function CardWrapper({ children, className = "" }) {
  return (
    <div
      className={cn(
        "grid",
        "grid-cols-1",
        "md:grid-cols-2",
        "lg:grid-cols-3",
        "gap-4",
        "mb-6",
        className,
      )}
    >
      {React.Children.map(children, (child) => React.cloneElement(child))}
    </div>
  );
}
export default React.memo(CardWrapper);
