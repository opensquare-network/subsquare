import { GradientBlanket } from "next-common/components/styled/tabList";
import { cn } from "next-common/utils";
import ScrollerX from "next-common/components/styled/containers/scrollerX";
import { useRef, forwardRef, useImperativeHandle } from "react";
import { noop } from "lodash-es";
import { HeaderDivider } from "../common/styled";
import { AccountColumn, VoteStatusColumn } from "./column";

const DvVotesMobileList = forwardRef(DvVotesMobileListInner);

export default DvVotesMobileList;

function DvVotesMobileListInner(
  { referendaCols, delegates, showLeft, showRight, onScroll = noop },
  parentRef,
) {
  const scrollerXRef = useRef();
  useImperativeHandle(parentRef, () => scrollerXRef.current);

  return (
    <div className="flex relative">
      <GradientBlanket className={cn(showLeft && "opacity-100")} />
      <GradientBlanket reversed className={cn(showRight && "opacity-100")} />
      <HeaderDivider />
      <ScrollerX
        ref={scrollerXRef}
        onScroll={onScroll}
        className="scrollbar-hidden"
      >
        <div className="flex-1 flex">
          <AccountColumn delegates={delegates} />
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
