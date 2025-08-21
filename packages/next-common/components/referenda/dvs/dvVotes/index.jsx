import { NeutralPanel } from "next-common/components/styled/containers/neutralPanel";
import WindowSizeProvider from "next-common/context/windowSize";
import { useIsMobile } from "next-common/components/overview/accountInfo/components/accountBalances";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import useWindowSize from "next-common/utils/hooks/useWindowSize";
import { TabsTitle } from "../common/styled";
import { VoteIndicator } from "../common/voteIndicator";
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
      <TabsTitle>DV Votes</TabsTitle>
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
  const { votes: allVotes, referenda, cohort } = usePageProps();
  const isMobile = useIsMobile();
  const { ss58Format } = useChainSettings();
  const scrollerXRef = useRef();
  const [showLeft, setShowLeft] = useState(false);
  const [showRight, setShowRight] = useState(false);
  const { width } = useWindowSize();

  const delegates = useMemo(
    () =>
      sortAddresses(
        cohort?.delegates?.map((delegate) => delegate.address) || [],
        ss58Format,
      ),
    [cohort, ss58Format],
  );

  const votesByReferendum = useMemo(
    () => groupBy(allVotes, "referendumIndex"),
    [allVotes],
  );

  const referendaCols = useMemo(
    () =>
      referenda.map((referendum) => {
        const votes = votesByReferendum[referendum.referendumIndex];
        const votesByDelegate = delegates.map((delegate) => [
          delegate,
          getVoteType(votes?.find((vote) => vote.account === delegate)),
        ]);

        return {
          ...referendum,
          votesByDelegate,
        };
      }),
    [referenda, votesByReferendum, delegates],
  );

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
