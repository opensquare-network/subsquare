import {
  EdgeLabelRenderer,
  BaseEdge,
  getSmoothStepPath,
  useNodesData,
} from "@xyflow/react";
import { DisplayUser } from "next-common/components/profile/bio";
import { indications } from "next-common/components/relationshipPopup/indications";
import Tooltip from "next-common/components/tooltip";
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
  source,
  target,
}) {
  const [edgePath, labelX, labelY] = getSmoothStepPath({
    sourceX,
    sourceY,
    sourcePosition,
    targetX,
    targetY,
    targetPosition,
  });

  const edgeTheme = indications.find((item) => item.name === data?.type);
  const sourceNode = useNodesData(source);
  const targetNode = useNodesData(target);

  if (!edgeTheme) {
    return null;
  }

  return (
    <>
      <BaseEdge
        id={id}
        path={edgePath}
        type="smoothstep"
        style={{ stroke: `${edgeTheme.color} !important` }}
        markerEnd={`url(#relationship_popup-arrow-${edgeTheme.name})`}
      />
      <EdgeLabelRenderer className="relative !z-20">
        <EdgeLabel
          className="h-5 rounded-[0.625rem] text12Medium leading-5 overflow-hidden flex border box-border items-center"
          style={{
            transform: `translate(-50%, -50%) translate(${labelX}px,${labelY}px)`,
            pointerEvents: "all",
            borderColor: edgeTheme.color,
          }}
        >
          <Tooltip
            className="flex items-center"
            content={
              <TooltipsContent
                type={edgeTheme.name}
                source={sourceNode?.data?.address}
                target={targetNode?.data?.address}
                value={data.value}
              />
            }
          >
            <span
              className="text-textPrimaryContrast pl-2 pr-1"
              style={{
                backgroundColor: edgeTheme.color,
              }}
            >
              {data.name}
            </span>
            <span
              className="pl-1 pr-2 bg-neutral100"
              style={{
                color: edgeTheme.color,
              }}
            >
              {data.value}
            </span>
          </Tooltip>
        </EdgeLabel>
      </EdgeLabelRenderer>
    </>
  );
}

function TooltipsContent({ type, ...rest }) {
  if (type === "Signatory") {
    return <SignatoryTipContent {...rest} />;
  }

  if (type === "Proxied" || type === "Received") {
    return <ProxiedTipContent {...rest} />;
  }

  return null;
}

function SignatoryTipContent({ source }) {
  return (
    <div className="flex gap-x-1 items-center">
      <DisplayUser id={source} className="flex text12Medium text-white" />
      <span>is one of the signatories of the multisig account</span>
      <span>Vault#2</span>
    </div>
  );
}

function ProxiedTipContent({ source, target, value = "" }) {
  return (
    <div className="flex gap-x-1 items-center">
      <DisplayUser id={source} className="flex text12Medium text-white" />
      <span>can submit extrinsics on behalf of</span>
      <DisplayUser id={target} className="flex text12Medium text-white" />
      <span>with proxy type `{value}`</span>
    </div>
  );
}
