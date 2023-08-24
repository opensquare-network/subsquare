"use client";

// d3
// https://github.com/opensquare-network/subsquare/issues/3326
// https://react-graph-gallery.com/circular-packing

import * as d3 from "d3";
import { get } from "lodash";
import noop from "lodash.noop";
import { Fragment } from "react";

export default function CirclePacking({
  data,
  width,
  height,
  sizeField = "value",
  keyField,
  bubbleClassName = "",
  bubbleContent = noop,
}) {
  const hierarchy = d3.hierarchy(data).sum((d) => d[sizeField]);

  const pack = d3
    .pack()
    .size([width || 1, height || 1])
    .padding(4);
  const root = pack(hierarchy);
  const nodes = root.descendants().slice(1);

  const allBubbles = nodes.map((node, idx) => {
    const { x, y, r } = node;
    const d = r * 2;

    const bubbleCircleClassName =
      typeof bubbleClassName === "function"
        ? bubbleClassName(node)
        : bubbleClassName;

    const bubbleCircleContent =
      typeof bubbleContent === "function" ? bubbleContent(node) : bubbleContent;

    return (
      <Fragment key={get(node.data, keyField) || idx}>
        <circle cx={x} cy={y} r={r} className={bubbleCircleClassName} />
        {bubbleCircleContent && (
          <foreignObject
            x={x - r}
            y={y - r}
            width={d}
            height={d}
            className="rounded-full"
          >
            {bubbleCircleContent}
          </foreignObject>
        )}
      </Fragment>
    );
  });

  return (
    <svg width={width} height={height}>
      {allBubbles}
    </svg>
  );
}
