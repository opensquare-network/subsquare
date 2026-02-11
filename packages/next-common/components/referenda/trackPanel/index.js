import React, { useMemo } from "react";
import { cn } from "next-common/utils";
import AccordionCard from "next-common/components/styled/containers/accordionCard";
import { otherCategoryMaxCount } from "./consts";
import { useTrackList } from "next-common/components/summary/newProposalPopup/useTrackDetail";
import { useListPageType } from "next-common/context/page";
import { listPageCategory } from "next-common/utils/consts/business/category";
import {
  flattenKusamaFellowshipReferenda,
  getCategorizedTracks,
  isOnlyOthersCategory,
  isOthersExceedMax,
} from "./utils";
import NormalCategoryItems from "./normalCategoryItems";
import OthersExceedingItems from "./otherExceedingItems";
import TrackPanelTitle from "./trackPanelTitle";
import { useChain } from "next-common/context/chain";
import Chains from "next-common/utils/consts/chains";

function TrackPanel({ className = "" }) {
  const tracks = useTrackList();
  const listPageType = useListPageType();
  const chain = useChain();

  const { trackList, isOthersExceeding } = useMemo(() => {
    let isOthersExceeding = false;
    let trackList = {};

    if (!tracks) {
      return {
        trackList,
        isOthersExceeding,
      };
    }

    const categorizedTracks = getCategorizedTracks(
      listPageType,
      listPageCategory,
      tracks,
    );

    if (
      listPageType === listPageCategory.REFERENDA &&
      (isOthersExceedMax(categorizedTracks) ||
        isOnlyOthersCategory(categorizedTracks, otherCategoryMaxCount))
    ) {
      categorizedTracks.others = Object.values(categorizedTracks || {}).flat();
      isOthersExceeding = true;
    }

    if (
      ![Chains.collectives].includes(chain) &&
      listPageType === listPageCategory.FELLOWSHIP_REFERENDA
    ) {
      isOthersExceeding = true;
      trackList = flattenKusamaFellowshipReferenda(
        listPageType,
        listPageCategory,
        tracks,
      );
      return {
        trackList,
        isOthersExceeding,
      };
    }

    return {
      trackList: categorizedTracks ?? {},
      isOthersExceeding,
    };
  }, [listPageType, tracks, chain]);

  const inlineClassName = isOthersExceeding
    ? "flex"
    : "grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-x-2";

  return (
    <div className={cn(className)}>
      <AccordionCard
        title={<TrackPanelTitle />}
        defaultOpen={false}
        className="px-4"
      >
        <div className={inlineClassName}>
          {Object.keys(trackList).map((category, index) => {
            if (!isOthersExceeding) {
              return (
                <NormalCategoryItems
                  category={category}
                  key={category + index}
                  trackList={trackList}
                />
              );
            } else {
              return (
                <OthersExceedingItems
                  category={category}
                  trackList={trackList}
                  key={category}
                />
              );
            }
          })}
        </div>
      </AccordionCard>
    </div>
  );
}

export default React.memo(TrackPanel);
