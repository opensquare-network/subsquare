import React from "react";
import { cn } from "next-common/utils";

const Wrapper = ({ children, className = "" }) => {
  return <div className={cn(className)}>{children}</div>;
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

const SkeletonItemFull = () => {
  return (
    <Wrapper className="w-full space-y-1.5">
      <SkeletonItem className="w-[28%] h-4" />
      <SkeletonItem className="w-[50%] h-5" />
    </Wrapper>
  );
};

const LoadingSkeleton = React.memo(function LoadingSkeleton() {
  return (
    <div className="w-full animate-pulse flex flex-col md:flex-row space-y-4 md:space-y-0">
      <Wrapper className=" flex md:flex-col w-full">
        <SkeletonItemFull />
        <Wrapper className="w-full h-full" />
      </Wrapper>
      <Wrapper className="flex md:flex-col w-full md:gap-4">
        <SkeletonItemFull />
        <SkeletonItemFull />
      </Wrapper>
      <Wrapper className="flex md:flex-col w-full md:gap-4">
        <SkeletonItemFull />
        <SkeletonItemFull />
      </Wrapper>
      <Wrapper className=" flex md:flex-col w-full">
        <SkeletonItemFull />
        <Wrapper className="w-full h-full" />
      </Wrapper>
    </div>
  );
});

export default LoadingSkeleton;
