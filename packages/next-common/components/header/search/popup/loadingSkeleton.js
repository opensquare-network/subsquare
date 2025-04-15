import React from "react";
import { cn } from "next-common/utils";

const Wrapper = ({ children, className = "" }) => {
  return <div className={cn("p-[10px]", className)}>{children}</div>;
};

const SkeletonItem = ({ className = "" }) => {
  return (
    <div
      className={cn(
        "h-5",
        "rounded-[4px]",
        "bg-gradient-to-r",
        "from-neutral200",
        "via-neutral200alpha",
        "to-neutral200",
        className,
      )}
    />
  );
};

const LoadingSkeleton = React.memo(function LoadingSkeleton() {
  return (
    //TODO: animate-pulse， Whether to add a pulse
    <div className="w-full">
      <Wrapper>
        <SkeletonItem className="w-[20%]" />
      </Wrapper>
      <Wrapper>
        <SkeletonItem className="w-[100%]" />
      </Wrapper>
      <Wrapper>
        <SkeletonItem className="w-[50%]" />
      </Wrapper>
      <Wrapper>
        <SkeletonItem className="w-[100%]" />
      </Wrapper>
      <Wrapper>
        <SkeletonItem className="w-[50%]" />
      </Wrapper>
    </div>
  );
});

export default LoadingSkeleton;
