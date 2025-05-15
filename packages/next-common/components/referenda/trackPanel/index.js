import React, { useMemo } from "react";
import { cn } from "next-common/utils";
import AccordionCard from "next-common/components/styled/containers/accordionCard";
import { MenuTracks } from "@osn/icons/subsquare";
import { usePageProps } from "next-common/context/page";
import { startCase, isNil } from "lodash-es";
import { trackCategoryMap, categoryIconMap } from "./consts";
import Link from "next/link";

function TrackPanel({ className = "" }) {
  const { tracks } = usePageProps();

  let title = (
    <div
      className={cn(
        "flex items-center",
        "text14Bold text-textPrimary capitalize",
      )}
    >
      <MenuTracks className="mr-2 w-6 h-6 [&_path]:fill-textSecondary" />
      <span className="group-hover/title:underline">OpenGov Tracks</span>
    </div>
  );

  const tracksDisplay = useMemo(() => {
    return (tracks ?? [])
      .map(({ id, name, activeCount }) => ({
        id,
        name: startCase(name),
        activeCount,
        path: `/referenda/tracks/${id}`,
      }))
      .reduce(
        (result, item) => {
          const category = Object.keys(trackCategoryMap).find((key) =>
            trackCategoryMap[key].includes(item.name),
          );
          if (category) {
            result[category].push(item);
          } else {
            result.others.push(item);
          }
          return result;
        },
        {
          treasury: [],
          governance: [],
          main_agenda: [],
          fellowship: [],
          others: [],
        },
      );
  }, [tracks]);

  return (
    <div className={cn(className)}>
      <AccordionCard title={title} defaultOpen={false}>
        <div className="grid grid-cols-5 gap-x-2">
          {Object.keys(tracksDisplay).map((category, index) => (
            <div key={index} className="">
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
                    <p>
                      <span className="leading-4 px-2 bg-neutral200 rounded-[8px]">
                        <Link
                          href={item.path}
                          className="hover:underline hover:decoration-neutral500"
                          onMouseEnter={() => {
                            // TODO: hover logic
                          }}
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
                    </p>
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
