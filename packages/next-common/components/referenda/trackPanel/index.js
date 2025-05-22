import React, { useMemo, useState } from "react";
import { cn } from "next-common/utils";
import AccordionCard from "next-common/components/styled/containers/accordionCard";
import { otherCategoryMaxCount } from "./consts";
import { useTrackList } from "next-common/components/summary/newProposalPopup/useTrackDetail";
import { useListPageType } from "next-common/context/page";
import { listPageCategory } from "next-common/utils/consts/business/category";
import {
  isOnlyOthersCategory,
  isOthersExceedMax,
  flattenKusamaFellowshipReferenda,
  getCategorizedTracks,
} from "./utils";
import NormalCategoryItems from "./normalCategoryItems";
import OthersExceedingItems from "./otherExceedingItems";
import TrackPanelTitle from "./trackPanelTitle";
import { isKusamaChain } from "next-common/utils/chain";
import { CHAIN } from "next-common/utils/constants";

const isKusama = isKusamaChain(CHAIN);

function TrackPanel({ className = "" }) {
  const tracks = useTrackList();
  const listPageType = useListPageType();
  const [isOthersExceeding, setIsOthersExceeding] = useState(false);

  const trackList = useMemo(() => {
    if (!tracks) return {};
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
      categorizedTracks.others = Object.values(categorizedTracks).flat();
      setIsOthersExceeding(true);
    }

    if (isKusama && listPageType === listPageCategory.FELLOWSHIP_REFERENDA) {
      setIsOthersExceeding(true);
      return flattenKusamaFellowshipReferenda(
        listPageType,
        listPageCategory,
        tracks,
      );
    }

    return categorizedTracks ?? {};
  }, [listPageType, tracks]);

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
