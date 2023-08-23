"use client";

// d3
// https://github.com/opensquare-network/subsquare/issues/3326
// https://react-graph-gallery.com/circular-packing

import * as d3 from "d3";
import noop from "lodash.noop";
import { Fragment } from "react";

export default function CirclePacking({
  data,
  width,
  height,
  sizeField = "value",
  bubbleCircleClassName = "",
  bubbleCircleContent = noop,
}) {
  const hierarchy = d3.hierarchy(data).sum((d) => d[sizeField]);

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

        const bubbleClassName =
          typeof bubbleCircleClassName === "function"
            ? bubbleCircleClassName(node)
            : bubbleCircleClassName;
        const bubbleContent =
          typeof bubbleCircleContent === "function"
            ? bubbleCircleContent(node)
            : bubbleCircleContent;

        return (
          <Fragment key={idx}>
            <circle cx={x} cy={y} r={r} className={bubbleClassName} />
            {bubbleContent && (
              <foreignObject
                x={node.x - r}
                y={node.y - r}
                width={d}
                height={d}
                className="rounded-full"
              >
                {bubbleContent}
              </foreignObject>
            )}
          </Fragment>
        );
      })}
    </svg>
  );
}
