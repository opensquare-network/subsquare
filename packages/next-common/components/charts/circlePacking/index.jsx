// d3
// https://github.com/opensquare-network/subsquare/issues/3326
// https://react-graph-gallery.com/circular-packing

import clsx from "clsx";
import * as d3 from "d3";
import { Fragment, useState } from "react";

export default function CirclePacking({ data, height, width }) {
  const [interactionData, setInteractionData] = useState();

  const hierarchy = d3
    .hierarchy(data)
    .sum((d) => d.votes)
    .sort((a, b) => b.votes - a.votes);
  const packGenerator = d3.pack().size([width, height]).padding(4);
  const root = packGenerator(hierarchy);

  return (
    <div className="relative">
      <svg width={width} height={height}>
        {root
          .descendants()
          .slice(1)
          .map((node, idx) => {
            const { x, y, r } = node;
            const d = r * 2;

            return (
              <Fragment key={idx}>
                <circle
                  cx={x}
                  cy={y}
                  r={r}
                  className={clsx(
                    node.data.aye && "fill-green300",
                    node.data.nay && "fill-red300",
                    node.data.abstain && "fill-neutral400",
                  )}
                />
                <foreignObject
                  x={node.x - r}
                  y={node.y - r}
                  width={d}
                  height={d}
                >
                  <div
                    className="rounded-full w-full h-full"
                    onMouseEnter={() => {
                      setInteractionData(node);
                    }}
                    onMouseLeave={() => {
                      setInteractionData(null);
                    }}
                  >
                    <div
                      className={clsx(
                        "flex items-center justify-center",
                        "text14Medium truncate",
                        node.data.aye && "text-green500",
                        node.data.nay && "text-red500",
                        node.data.abstain && "text-textSecondary",
                      )}
                    >
                      {node.data.name}
                    </div>
                  </div>
                </foreignObject>
              </Fragment>
            );
          })}
      </svg>

      {/* tooltip */}
      {interactionData && <div className="absolute"></div>}
    </div>
  );
}
