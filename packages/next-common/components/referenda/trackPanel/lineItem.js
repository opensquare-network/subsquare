import React from "react";
import { cn } from "next-common/utils";

function Wrapper({ children, className = "" }) {
  return (
    <div
      className={cn(
        "p-4",
        "bg-white",
        "rounded-[8px]",
        "opacity-100",
        "border",
        "border-neutral300",
        className,
      )}
    >
      {React.Children.map(children, (child) => React.cloneElement(child))}
    </div>
  );
}

function Divider({ className = "" }) {
  return <p className={cn("h-[1px]", "bg-neutral300", className)} />;
}

function LineBox({ className = "", children }) {
  return (
    <p
      className={cn(
        "flex",
        "flex-1",
        "justify-between",
        "items-center",
        "leading-5",
        "mb-1",
        className,
      )}
    >
      {React.Children.map(children, (child) => React.cloneElement(child))}
    </p>
  );
}

function LineTitle({ className, title = "" }) {
  return (
    <span className={cn("text14Medium", "text-textTertiary", className)}>
      {title}
    </span>
  );
}
function LineValue({ className, children }) {
  return (
    <span className={cn("text14Medium", "text-textPrimary", className)}>
      {React.Children.map(children, (child) => React.cloneElement(child))}
    </span>
  );
}

export { Wrapper, LineBox, LineTitle, LineValue, Divider };
