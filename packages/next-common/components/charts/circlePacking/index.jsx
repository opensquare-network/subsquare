"use client";

// d3
// https://github.com/opensquare-network/subsquare/issues/3326
// https://react-graph-gallery.com/circular-packing

import clsx from "clsx";
import * as d3 from "d3";
import { Fragment } from "react";
import Tooltip from "next-common/components/tooltip";

export default function CirclePacking({ data, width, height }) {
  const hierarchy = d3
    .hierarchy(data)
    .sum((d) => d.votes)
    .sort((a, b) => b.votes - a.votes);
  const pack = d3
    .pack()
    .size([width || 1, height || 1])
    .padding(4);
  const root = pack(hierarchy);
  const nodes = root.descendants().slice(1);

  return (
    <svg width={width} height={height}>
      {nodes.map((node, idx) => {
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
                node.data.aye === false && "fill-red300",
                node.data.isAbstain && "fill-neutral400",
              )}
            />
            <foreignObject x={node.x - r} y={node.y - r} width={d} height={d}>
              <Tooltip
                className="!block h-full"
                content={<div>{node.data.account}</div>}
              >
                <div className="rounded-full w-full h-full">
                  {/* TODO: identity */}
                </div>
              </Tooltip>
            </foreignObject>
          </Fragment>
        );
      })}
    </svg>
  );
}
