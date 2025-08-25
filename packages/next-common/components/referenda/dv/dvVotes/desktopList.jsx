import { forwardRef, useImperativeHandle, useRef } from "react";
import { GradientBlanket } from "next-common/components/styled/tabList";
import { cn } from "next-common/utils";
import ScrollerX from "next-common/components/styled/containers/scrollerX";
import { noop } from "lodash-es";
import { AccountColumn, VoteStatusColumn } from "./column";
import { HeaderDivider } from "../common/styled";

const DvVotesDesktopList = forwardRef(DvVotesDesktopListInner);

export default DvVotesDesktopList;

function DvVotesDesktopListInner(
  { referendaCols, delegates, showLeft, showRight, onScroll = noop },
  parentRef,
) {
  const scrollerXRef = useRef();

  useImperativeHandle(parentRef, () => scrollerXRef.current);

  return (
    <div className="flex relative">
      <AccountColumn accounts={delegates} />
      <GradientBlanket
        className={cn(
          "left-[240px] max-sm:left-[200px]",
          showLeft && "opacity-100",
        )}
      />
      <GradientBlanket reversed className={cn(showRight && "opacity-100")} />
      <HeaderDivider />
      <ScrollerX
        ref={scrollerXRef}
        className="flex-1 scrollbar-hidden"
        onScroll={onScroll}
      >
        <div className="flex-1 flex">
          {referendaCols.map((col, idx) => (
            <VoteStatusColumn
              col={col}
              key={idx}
              title={`#${col.referendumIndex}`}
            />
          ))}
        </div>
      </ScrollerX>
    </div>
  );
}
