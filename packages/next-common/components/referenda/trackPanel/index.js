import React, { useMemo, useState } from "react";
import { cn } from "next-common/utils";
import AccordionCard from "next-common/components/styled/containers/accordionCard";
import { startCase } from "lodash-es";
import {
  gov2TrackCategoryMap,
  gov2InitialObj,
  fellowshipTrackCategoryMap,
  fellowshipInitialObj,
  otherCategoryMaxCount,
} from "./consts";
import { useTrackList } from "next-common/components/summary/newProposalPopup/useTrackDetail";
import { useListPageType } from "next-common/context/page";
import { listPageCategory } from "next-common/utils/consts/business/category";
import useRefCallback from "next-common/hooks/useRefCallback";
import { isOnlyOthersCategory, isOthersExceedMax } from "./utils";
import NormalCategoryDisplay from "./normalCategoryDisplay";
import OthersExceedingDisplay from "./otherExceedingDisplay";
import TrackPanelTitle from "./trackPanelTitle";

function TrackPanel({ className = "" }) {
  const tracks = useTrackList();
  const listPageType = useListPageType();
  const [isOthersExceeding, setIsOthersExceeding] = useState(false);

  const combinePathWithId = useRefCallback((id) => {
    switch (listPageType) {
      case listPageCategory.FELLOWSHIP_REFERENDA:
        return `/fellowship/tracks/${id}`;
      case listPageCategory.AMBASSADOR_REFERENDA:
        return `/ambassador/tracks/${id}`;
      default:
        return `/referenda/tracks/${id}`;
    }
  });

  const tracksDisplay = useMemo(() => {
    if (!tracks) return {};

    let trackCategoryMap, initialObj;
    if (listPageType === listPageCategory.REFERENDA) {
      trackCategoryMap = gov2TrackCategoryMap;
      initialObj = JSON.parse(JSON.stringify(gov2InitialObj));
    }
    if (listPageType === listPageCategory.FELLOWSHIP_REFERENDA) {
      trackCategoryMap = fellowshipTrackCategoryMap;
      initialObj = JSON.parse(JSON.stringify(fellowshipInitialObj));
    }

    const category_tracks = tracks
      .map(({ id, name, activeCount }) => ({
        id,
        name: startCase(name),
        activeCount,
        path: combinePathWithId(id),
      }))
      .reduce((result, item) => {
        const category = Object.keys(trackCategoryMap ?? {}).find((key) =>
          trackCategoryMap[key].includes(item.name),
        );
        if (category) {
          result[category].push(item);
        } else if (result?.["others"]) {
          result["others"].push(item);
        }
        return result;
      }, initialObj);

    if (listPageType === listPageCategory.REFERENDA) {
      if (
        isOthersExceedMax(category_tracks) ||
        isOnlyOthersCategory(category_tracks, otherCategoryMaxCount)
      ) {
        const allCategories = Object.values(category_tracks).flat();
        category_tracks.others = allCategories;
        setIsOthersExceeding(true);
      }
    }

    return category_tracks ?? {};
  }, [combinePathWithId, listPageType, tracks]);

  return (
    <div className={cn(className)}>
      <AccordionCard
        title={<TrackPanelTitle />}
        defaultOpen={false}
        className="px-4"
      >
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-x-2">
          {Object.keys(tracksDisplay).map((category, index) => {
            if (!isOthersExceeding) {
              return (
                <NormalCategoryDisplay
                  category={category}
                  key={category + index}
                  tracksDisplay={tracksDisplay}
                />
              );
            } else {
              return (
                <OthersExceedingDisplay
                  category={category}
                  tracksDisplay={tracksDisplay}
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
