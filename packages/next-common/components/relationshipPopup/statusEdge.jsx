import {
  EdgeLabelRenderer,
  BaseEdge,
  getSmoothStepPath,
  useNodesData,
} from "@xyflow/react";
import { isNil } from "lodash-es";
import { DisplayUser } from "next-common/components/profile/bio";
import { allIndications } from "next-common/components/relationshipPopup/indications";
import Tooltip from "next-common/components/tooltip";
import { rootNodeId } from "next-common/hooks/useRelationshipNode";
import styled from "styled-components";
import { useTrackContent } from "../referenda/track/trackTag";
import ValueDisplay from "../valueDisplay";
import { toPrecision } from "next-common/utils";
import { useChainSettings } from "next-common/context/chain";

const EdgeLabel = styled.div`
  position: absolute;
`;

const lineConvergeWidth = 30;

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
  const onRootNodeRight = rootNodeId === source;
  const edgePathCenterX = onRootNodeRight
    ? sourceX + lineConvergeWidth
    : targetX - lineConvergeWidth;

  const [edgePath, labelX] = getSmoothStepPath({
    sourceX,
    sourceY,
    sourcePosition,
    targetX,
    targetY,
    targetPosition,
    centerX: edgePathCenterX,
  });

  const edgeTheme = allIndications.find((item) => item.name === data?.type);
  const sourceNode = useNodesData(source);
  const targetNode = useNodesData(target);

  if (!edgeTheme) {
    return null;
  }

  let labelOffsetX = targetX - sourceX / 2 - lineConvergeWidth / 2;
  let labelOffsetY = sourceY;
  if (onRootNodeRight) {
    labelOffsetX = targetX - (targetX - labelX) / 2 - lineConvergeWidth / 2;
    labelOffsetY = targetY;
  }

  return (
    <>
      <BaseEdge
        id={id}
        path={edgePath}
        type="smoothstep"
        style={{ stroke: `${edgeTheme.color} !important` }}
        markerEnd={`url(#relationship_popup-arrow-${edgeTheme.name})`}
        markerStart={
          data?.isTwoWay
            ? `url(#relationship_popup-arrow-start-${edgeTheme.name})`
            : undefined
        }
      />
      <EdgeLabelRenderer className="relative !z-20">
        <EdgeLabel
          className="h-5 rounded-[0.625rem] text12Medium leading-5 overflow-hidden flex border box-border items-center"
          style={{
            transform: `translate(-50%, -50%) translate(${
              labelOffsetX + lineConvergeWidth / 2
            }px,${labelOffsetY}px)`,
            pointerEvents: "all",
            backgroundColor: edgeTheme.color,
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
                rawData={data}
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
  if (type === "Multisig") {
    return <MultisigTipContent {...rest} />;
  }

  if (type === "Proxy") {
    return <ProxyTipContent {...rest} />;
  }

  if (type === "Identity") {
    return <IdentityTipContent {...rest} />;
  }

  if (type === "Delegation") {
    return <DelegationTipContent {...rest} />;
  }

  if (type === "Transfer") {
    return <TransferTipContent {...rest} />;
  }

  return null;
}

function MultisigTipContent({ source, target }) {
  return (
    <div className="flex gap-x-1 items-center">
      <DisplayUser id={source} className="flex text12Medium text-white" />
      <span>is one of the signatories of the multisig account</span>
      <DisplayUser id={target} className="flex text12Medium text-white" />
    </div>
  );
}

function ProxyTipContent({ source, target, value = "" }) {
  return (
    <div className="flex gap-x-1 items-center">
      <DisplayUser id={source} className="flex text12Medium text-white" />
      <span>can submit extrinsics on behalf of</span>
      <DisplayUser id={target} className="flex text12Medium text-white" />
      <span>with proxy type {value}</span>
    </div>
  );
}

function IdentityTipContent({ source, target, value }) {
  if (value === "Sub") {
    return (
      <div className="flex gap-x-1 items-center">
        <DisplayUser id={target} className="flex text12Medium text-white" />
        <span>has a sub identity of</span>
        <DisplayUser id={source} className="flex text12Medium text-white" />
      </div>
    );
  }

  return (
    <div className="flex gap-x-1 items-center">
      <DisplayUser id={source} className="flex text12Medium text-white" />
      <span>has the parent identity of</span>
      <DisplayUser id={target} className="flex text12Medium text-white" />
    </div>
  );
}

function DelegationTipContent({ rawData }) {
  const { decimals, symbol } = useChainSettings();
  if (isNil(rawData) || isNil(rawData.tracks)) {
    return null;
  }

  const items = Array.from(rawData.tracks.values());

  return (
    <ul className="text12Medium">
      {items.map((track) => (
        <li key={track.trackId} className="flex items-center">
          <TrackItem id={track.trackId} />
          <span className="mr-1">:</span>
          <ValueDisplay
            value={toPrecision(track.balance, decimals)}
            symbol={symbol}
          />
        </li>
      ))}
    </ul>
  );
}

function TransferTipContent({ rawData }) {
  const { decimals, symbol } = useChainSettings();
  const { data: transfer } = rawData || {};

  if (isNil(transfer)) {
    return null;
  }

  return (
    <div className="flex gap-x-1 items-center flex-col">
      <div className="flex gap-x-1 items-center">
        <DisplayUser
          id={transfer.from}
          username={rawData.username}
          className="flex text12Medium text-white"
        />
        <span>transferred {transfer.count} times</span>
        <DisplayUser
          id={transfer.to}
          username={rawData.username}
          className="flex text12Medium text-white"
        />
        <span>total </span>
        <ValueDisplay
          value={toPrecision(transfer.volume, decimals)}
          symbol={symbol}
        />
      </div>
    </div>
  );
}

function TrackItem({ id }) {
  const trackInfo = useTrackContent(id);
  return <span>{trackInfo}</span>;
}
