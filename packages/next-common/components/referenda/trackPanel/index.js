import React, { useMemo, useState } from "react";
import { cn } from "next-common/utils";
import AccordionCard from "next-common/components/styled/containers/accordionCard";
import { MenuTracks } from "@osn/icons/subsquare";
import { startCase, isNil } from "lodash-es";
import {
  gov2TrackCategoryMap,
  gov2CategoryIconMap,
  gov2InitialObj,
  fellowshipTrackCategoryMap,
  fellowshipCategoryIconMap,
  fellowshipInitialObj,
  otherCategoryMaxCount,
} from "./consts";
import Link from "next/link";
import TrackTooltip from "./trackTooltip";
import { useTrackList } from "next-common/components/summary/newProposalPopup/useTrackDetail";
import { useListPageType } from "next-common/context/page";
import { listPageCategory } from "next-common/utils/consts/business/category";
import useRefCallback from "next-common/hooks/useRefCallback";
import { isOnlyOthersCategory, isOthersExceedMax } from "./utils";

function TrackCategoryItem({ item }) {
  return (
    <TrackTooltip trackId={item.id}>
      <span className="leading-4 px-2 bg-neutral200 rounded-[8px]">
        <Link
          href={item.path}
          className="hover:underline hover:decoration-neutral500"
          onClick={(e) => {
            e.stopPropagation();
          }}
        >
          {item.name}
        </Link>
      </span>

      {!isNil(item.activeCount) && item.activeCount > 0 && (
        <span className="text-textTertiary">{` · ${item.activeCount}`}</span>
      )}
    </TrackTooltip>
  );
}

function TrackPanel({ className = "" }) {
  const tracks = useTrackList();
  const listPageType = useListPageType();
  const [isOthersExceeding, setIsOthersExceeding] = useState(false);

  let title = (
    <div
      className={cn(
        "flex items-center",
        "text14Bold text-textPrimary capitalize",
      )}
    >
      <MenuTracks className="mr-2 w-6 h-6 [&_path]:fill-textSecondary" />
      <span className="group-hover/title:underline">Referenda Tracks</span>
    </div>
  );

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

  const iconsDisplay = useMemo(() => {
    if (listPageType === listPageCategory.REFERENDA) {
      return gov2CategoryIconMap;
    }
    if (listPageType === listPageCategory.FELLOWSHIP_REFERENDA) {
      return fellowshipCategoryIconMap;
    }
  }, [listPageType]);

  return (
    <div className={cn(className)}>
      <AccordionCard title={title} defaultOpen={false}>
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-x-2">
          {Object.keys(tracksDisplay).map((category, index) => {
            if (!isOthersExceeding) {
              return (
                <div key={category + index}>
                  <p className="ml-2 mt-4">{iconsDisplay?.[category]}</p>
                  <p className="text14Bold text-textPrimary p-2">
                    {startCase(category)}
                  </p>
                  <ul className="mb-4">
                    {tracksDisplay?.[category].map((item, idx) => (
                      <li
                        key={idx}
                        className="text12Medium text-textSecondary py-1.5"
                      >
                        <TrackCategoryItem item={item} />
                      </li>
                    ))}
                  </ul>
                </div>
              );
            } else {
              if (category === "others") {
                const chunkSize = 8;
                const chunks = [];
                for (
                  let i = 0;
                  i < tracksDisplay[category].length;
                  i += chunkSize
                ) {
                  chunks.push(tracksDisplay[category].slice(i, i + chunkSize));
                }

                return chunks.map((chunk, chunkIndex) => (
                  <div key={`${chunk}-${chunkIndex}`}>
                    <ul className="my-4">
                      {chunk.map((item, idx) => (
                        <li
                          key={idx}
                          className="text12Medium text-textSecondary py-1.5"
                        >
                          <TrackCategoryItem item={item} />
                        </li>
                      ))}
                    </ul>
                  </div>
                ));
              }
            }
          })}
        </div>
      </AccordionCard>
    </div>
  );
}

export default React.memo(TrackPanel);
