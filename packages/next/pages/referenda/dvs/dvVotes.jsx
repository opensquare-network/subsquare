import { NeutralPanel } from "next-common/components/styled/containers/neutralPanel";
import ScrollerX from "next-common/components/styled/containers/scrollerX";
import WindowSizeProvider from "next-common/context/windowSize";
import { useIsMobile } from "next-common/components/overview/accountInfo/components/accountBalances";
import { GradientBlanket } from "next-common/components/styled/tabList";
import { cn } from "next-common/utils";
import { useEffect, useRef, useState } from "react";
import useWindowSize from "next-common/utils/hooks/useWindowSize";
import {
  AccountColumn,
  DvVotesTitle,
  HeaderDivider,
  VoteStatusColumn,
  VoteIndicator,
} from "./common/dvVotesStyled";
import Divider from "next-common/components/styled/layout/divider";

const referenda = [...Array(20)];

const SPACE = 1;

export default function ReferendaDVsVotes() {
  return (
    <div className="flex flex-col gap-y-4">
      <DvVotesTitle />
      <NeutralPanel className="p-6">
        <WindowSizeProvider>
          <ReferendaDVsVotesImpl />
          <Divider />
          <VoteIndicator />
        </WindowSizeProvider>
      </NeutralPanel>
    </div>
  );
}

export function ReferendaDVsVotesImpl() {
  const isMobile = useIsMobile();

  const scrollerXRef = useRef();
  const [showLeft, setShowLeft] = useState(false);
  const [showRight, setShowRight] = useState(false);
  const { width } = useWindowSize();

  useEffect(() => {
    if (scrollerXRef.current) {
      handleGradientBlanketVisible(scrollerXRef.current);
    }
  }, [scrollerXRef, width]);

  function handleGradientBlanketVisible(target) {
    const { scrollLeft, scrollWidth, clientWidth } = target;
    const scrollSpace = scrollWidth - clientWidth;

    setShowLeft(scrollLeft > SPACE);
    setShowRight(scrollLeft < scrollSpace - SPACE);
  }

  function onScroll(event) {
    const target = event.target;
    handleGradientBlanketVisible(target);
  }

  if (isMobile) {
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
            <AccountColumn />
            {referenda.map((_, idx) => (
              <VoteStatusColumn key={idx} title={`#${idx + 1}`} />
            ))}
          </div>
        </ScrollerX>
      </div>
    );
  }

  return (
    <div className="flex relative">
      <AccountColumn />
      <GradientBlanket
        className={cn(
          "left-[272px] max-sm:left-[200px]",
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
          {referenda.map((_, idx) => (
            <VoteStatusColumn key={idx} title={`#${idx + 1}`} />
          ))}
        </div>
      </ScrollerX>
    </div>
  );
}
