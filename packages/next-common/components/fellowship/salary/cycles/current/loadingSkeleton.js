import React from "react";
import { cn } from "next-common/utils";
import { Skeleton } from "next-common/components/skeleton";

const Wrapper = ({ children, className = "" }) => {
  return <div className={cn(className)}>{children}</div>;
};

const SkeletonItemFull = () => {
  return (
    <Wrapper className="w-full space-y-1.5">
      <Skeleton className="w-[28%] h-4" />
      <Skeleton className="w-[50%] h-5" />
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
