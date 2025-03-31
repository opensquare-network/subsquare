import { EdgeLabelRenderer, BaseEdge, getSmoothStepPath } from "@xyflow/react";
import styled from "styled-components";

const EdgeLabel = styled.div`
  position: absolute;
`;

export default function StatusEdge({
  id,
  sourceX,
  sourceY,
  targetX,
  targetY,
  sourcePosition,
  targetPosition,
  data,
}) {
  const [edgePath, labelX, labelY] = getSmoothStepPath({
    sourceX,
    sourceY,
    sourcePosition,
    targetX,
    targetY,
    targetPosition,
  });

  return (
    <>
      <BaseEdge
        id={id}
        path={edgePath}
        type="smoothstep"
        className="!stroke-green500"
        markerEnd={{
          type: "url(#relationship_popup-arrow)",
          color: "var(--green500)",
        }}
      />
      <EdgeLabelRenderer>
        <EdgeLabel
          className="h-5 rounded-[0.625rem] overflow-hidden flex border border-green500 box-border items-center"
          style={{
            transform: `translate(-50%, -50%) translate(${labelX}px,${labelY}px)`,
          }}
        >
          <span className="text12Medium text-textPrimaryContrast pl-2 pr-1 bg-green500 leading-5 h-5">
            {data.type}
          </span>
          <span className="text12Medium text-green500 pl-1 pr-2 bg-neutral100 leading-5 h-5">
            {data.label}
          </span>
        </EdgeLabel>
      </EdgeLabelRenderer>
    </>
  );
}
