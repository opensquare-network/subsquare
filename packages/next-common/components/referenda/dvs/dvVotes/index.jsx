import { NeutralPanel } from "next-common/components/styled/containers/neutralPanel";
import WindowSizeProvider from "next-common/context/windowSize";
import { useIsMobile } from "next-common/components/overview/accountInfo/components/accountBalances";
import { useEffect, useRef, useState } from "react";
import useWindowSize from "next-common/utils/hooks/useWindowSize";
import { DvVotesTitle, VoteIndicator } from "../common/dvVotesStyled";
import Divider from "next-common/components/styled/layout/divider";
import { usePageProps } from "next-common/context/page";
import getVoteType from "next-common/utils/dv/voteType";
import { groupBy } from "lodash-es";
import { useChainSettings } from "next-common/context/chain";
import { sortAddresses } from "@polkadot/util-crypto";
import DvVotesMobileList from "./mobileList";
import DvVotesDesktopList from "./desktopList";

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
  const { ss58Format } = useChainSettings();
  const { votes: votesRaw, referenda, cohort } = usePageProps();

  const delegates = sortAddresses(
    cohort?.delegates?.map((delegate) => delegate.address) || [],
    ss58Format,
  );

  const votesByReferendum = groupBy(votesRaw, "referendumIndex");

  const referendaCols = referenda.map((referendum) => {
    const votes = votesByReferendum[referendum.referendumIndex];
    const votesByDelegate = delegates.map((delegate) => [
      delegate,
      getVoteType(votes?.find((vote) => vote.account === delegate)),
    ]);

    return {
      ...referendum,
      votesByDelegate,
    };
  });

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
      <DvVotesMobileList
        ref={scrollerXRef}
        referendaCols={referendaCols}
        delegates={delegates}
        showLeft={showLeft}
        showRight={showRight}
        onScroll={onScroll}
      />
    );
  }

  return (
    <DvVotesDesktopList
      ref={scrollerXRef}
      referendaCols={referendaCols}
      delegates={delegates}
      showLeft={showLeft}
      showRight={showRight}
      onScroll={onScroll}
    />
  );
}
