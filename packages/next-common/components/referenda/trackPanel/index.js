import React, { useMemo } from "react";
import { cn } from "next-common/utils";
import AccordionCard from "next-common/components/styled/containers/accordionCard";
import { MenuTracks } from "@osn/icons/subsquare";
import { startCase, isNil } from "lodash-es";
import { trackCategoryMap, categoryIconMap } from "./consts";
import Link from "next/link";
import TrackTooltip from "./trackTooltip";
import { useTrackList } from "next-common/components/summary/newProposalPopup/useTrackDetail";
import { useListPageType } from "next-common/context/page";
import { listPageCategory } from "next-common/utils/consts/business/category";
import useRefCallback from "next-common/hooks/useRefCallback";

function TrackPanel({ headerTitle = "", className = "" }) {
  const tracks = useTrackList();
  const listPageType = useListPageType();

  let title = (
    <div
      className={cn(
        "flex items-center",
        "text14Bold text-textPrimary capitalize",
      )}
    >
      <MenuTracks className="mr-2 w-6 h-6 [&_path]:fill-textSecondary" />
      <span className="group-hover/title:underline">{headerTitle}</span>
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
    return (tracks ?? [])
      .map(({ id, name, activeCount }) => ({
        id,
        name: startCase(name),
        activeCount,
        path: combinePathWithId(id),
      }))
      .reduce(
        (result, item) => {
          const category = Object.keys(trackCategoryMap).find((key) =>
            trackCategoryMap[key].includes(item.name),
          );
          if (category) {
            result[category].push(item);
          }
          return result;
        },
        {
          system: [],
          treasury: [],
          governance: [],
          fellowship: [],
          others: [],
        },
      );
  }, [combinePathWithId, tracks]);

  return (
    <div className={cn(className)}>
      <AccordionCard title={title} defaultOpen={false}>
        <div className="grid grid-cols-5 gap-x-2">
          {Object.keys(tracksDisplay).map((category, index) => (
            <div key={index + category} className="">
              <p className="ml-2">{categoryIconMap[category]}</p>
              <p className="text14Bold text-textPrimary p-2">
                {startCase(category)}
              </p>
              <ul>
                {tracksDisplay[category].map((item, idx) => (
                  <li
                    key={idx}
                    className="text12Medium text-textSecondary py-1.5 "
                  >
                    {/* DOING */}
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
                        <span className="text-textTertiary">
                          {` · ${item.activeCount}`}
                        </span>
                      )}
                    </TrackTooltip>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </AccordionCard>
    </div>
  );
}

export default React.memo(TrackPanel);
