import { NeutralPanel } from "next-common/components/styled/containers/neutralPanel";
import WindowSizeProvider from "next-common/context/windowSize";
import { useIsMobile } from "next-common/components/overview/accountInfo/components/accountBalances";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import useWindowSize from "next-common/utils/hooks/useWindowSize";
import { TabsTitle } from "../common/styled";
import { VoteIndicator } from "../common/voteIndicator";
import Divider from "next-common/components/styled/layout/divider";
import getVoteType from "next-common/utils/dv/voteType";
import { groupBy } from "lodash-es";
import DvVotesMobileList from "./mobileList";
import DvVotesDesktopList from "./desktopList";
import {
  useFilteredDvReferenda,
  useFilteredDvVotes,
} from "next-common/context/referenda/dv";
import useFormattedDelegates from "next-common/hooks/referenda/useFormattedDelegates";

const SPACE = 1;

export default function DvReferendaVotes() {
  return (
    <div className="flex flex-col gap-y-4">
      <TabsTitle>DV Votes</TabsTitle>
      <NeutralPanel className="p-6">
        <WindowSizeProvider>
          <DvReferendaVotesImpl />
          <Divider />
          <VoteIndicator />
        </WindowSizeProvider>
      </NeutralPanel>
    </div>
  );
}

export function DvReferendaVotesImpl() {
  const isMobile = useIsMobile();
  const scrollerXRef = useRef();
  const [showLeft, setShowLeft] = useState(false);
  const [showRight, setShowRight] = useState(false);
  const { width } = useWindowSize();
  const filteredReferenda = useFilteredDvReferenda();
  const filteredVotes = useFilteredDvVotes();

  const formattedDelegates = useFormattedDelegates();

  const sortedDelegatesAddress = formattedDelegates.map(
    (delegate) => delegate.address,
  );

  const votesByReferendum = useMemo(
    () => groupBy(filteredVotes, "referendumIndex"),
    [filteredVotes],
  );

  const referendaCols = useMemo(() => {
    return filteredReferenda.map((referendum) => {
      const votes = votesByReferendum[referendum.referendumIndex];
      const votesByDelegate = sortedDelegatesAddress.map((delegate) => [
        delegate,
        getVoteType(votes?.find((vote) => vote.account === delegate)),
      ]);

      return {
        ...referendum,
        votesByDelegate,
      };
    });
  }, [filteredReferenda, votesByReferendum, sortedDelegatesAddress]);

  const handleGradientBlanketVisible = useCallback((target) => {
    const { scrollLeft, scrollWidth, clientWidth } = target;
    const scrollSpace = scrollWidth - clientWidth;
    setShowLeft(scrollLeft > SPACE);
    setShowRight(scrollLeft < scrollSpace - SPACE);
  }, []);

  const onScroll = useCallback(
    (event) => {
      const target = event.target;
      handleGradientBlanketVisible(target);
    },
    [handleGradientBlanketVisible],
  );

  useEffect(() => {
    if (scrollerXRef.current) {
      handleGradientBlanketVisible(scrollerXRef.current);
    }
  }, [scrollerXRef, width, handleGradientBlanketVisible]);

  if (isMobile) {
    return (
      <DvVotesMobileList
        ref={scrollerXRef}
        referendaCols={referendaCols}
        delegates={sortedDelegatesAddress}
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
      delegates={sortedDelegatesAddress}
      showLeft={showLeft}
      showRight={showRight}
      onScroll={onScroll}
    />
  );
}
