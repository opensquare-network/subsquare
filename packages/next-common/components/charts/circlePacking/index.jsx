"use client";

// d3
// https://github.com/opensquare-network/subsquare/issues/3326
// https://react-graph-gallery.com/circular-packing

import * as d3 from "d3";
import noop from "lodash.noop";
import { Fragment, useEffect, useMemo, useState } from "react";

export default function CirclePacking({
  data,
  width,
  height,
  sizeField = "value",
  keyField, // children key
  bubbleClassName = "",
  renderBubbleContent = noop,
}) {
  const [nodes, setNodes] = useState([]);
  useEffect(() => {
    if (!width || !height) {
      return;
    }

    const hierarchy = d3.hierarchy(data).sum((d) => parseInt(d[sizeField]));
    const pack = d3.pack().size([width, height]).padding(4);
    const root = pack(hierarchy);
    setNodes(root.descendants().slice(1));
  }, [width, height, data]);

  const allBubbles = useMemo(() => {
    return nodes.map((node, idx) => {
      const { x, y, r } = node;
      const d = r * 2;
      const circleClassName = bubbleClassName?.(node) || bubbleClassName;
      const bubbleContent = renderBubbleContent?.(node) || null;

      return (
        <Fragment key={node.data[keyField] || idx}>
          <circle cx={x} cy={y} r={r} className={circleClassName} />
          {bubbleContent && (
            <foreignObject
              x={x - r}
              y={y - r}
              width={d}
              height={d}
              className="rounded-full"
            >
              {bubbleContent}
            </foreignObject>
          )}
        </Fragment>
      );
    });
  }, [nodes]);

  return (
    <svg width={width} height={height}>
      {allBubbles}
    </svg>
  );
}
