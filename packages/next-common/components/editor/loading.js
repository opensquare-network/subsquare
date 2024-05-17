import { cn } from "next-common/utils";
import styled from "styled-components";

const Skeleton = styled.div`
  border-radius: 4px;
  background: linear-gradient(
    90deg,
    var(--neutral200) 0%,
    var(--neutral200alpha) 49.5%,
    var(--neutral200) 100%
  );
`;

export default function LoadingEditor() {
  return (
    <div
      className={cn(
        "flex flex-col",
        "absolute top-0 right-0 bottom-0 left-0",
        "border border-neutral400 rounded-[8px]",
        "z-[-1]",
      )}
    >
      <div className="flex p-[8px] border-b border-neutral300 gap-[8px] sm:hidden">
        <Skeleton className="h-[24px] grow" />
        <Skeleton className="h-[24px] grow" />
      </div>
      <div className="flex justify-between p-[8px] border-b border-neutral300">
        <div className="flex gap-[8px] max-sm:hidden">
          <Skeleton className="h-[24px] w-[80px]" />
          <Skeleton className="h-[24px] w-[80px]" />
        </div>
        <Skeleton className="h-[24px] grow sm:max-w-[240px]" />
      </div>
      <div className="grow"></div>
      <div className="flex justify-between p-[8px] gap-[16px] border-t border-neutral300">
        <Skeleton className="h-[24px] grow sm:max-w-[400px]" />
        <Skeleton className="h-[24px] w-[80px]" />
      </div>
    </div>
  );
}
