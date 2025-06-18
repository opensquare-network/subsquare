import React from "react";
import { cn } from "next-common/utils";
import { Skeleton } from "next-common/components/skeleton";

const Wrapper = ({ children, className = "" }) => {
  return <div className={cn("p-[10px]", className)}>{children}</div>;
};

const LoadingSkeleton = React.memo(function LoadingSkeleton() {
  return (
    <div className="px-2 w-full animate-pulse">
      <Wrapper>
        <Skeleton className="w-[20%] h-5" />
      </Wrapper>
      <Wrapper>
        <Skeleton className="w-[100%] h-5" />
      </Wrapper>
      <Wrapper>
        <Skeleton className="w-[50%] h-5" />
      </Wrapper>
      <Wrapper>
        <Skeleton className="w-[100%] h-5" />
      </Wrapper>
      <Wrapper>
        <Skeleton className="w-[50%] h-5" />
      </Wrapper>
    </div>
  );
});

export default LoadingSkeleton;
