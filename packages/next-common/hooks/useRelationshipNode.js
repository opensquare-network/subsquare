import { useIsPureProxy } from "next-common/hooks/profile/useFetchProfileProxies";
import useMultisigAddress from "next-common/hooks/useMultisigAddress";
import Tooltip from "next-common/components/tooltip";
import Link from "next/link";

export const rootNodeId = "rootNode";
export const nodeInitialWidth = 240;
export const nodeInitialHeight = 80;

export function createBadge(multisig) {
  let badge = "";
  if (multisig && multisig.signatories) {
    badge = `${multisig.threshold}/${multisig.signatories.length}`;
  }
  return badge;
}

export function BadgeInfo({ address }) {
  const { result, loading } = useMultisigAddress(address);
  if (!result || loading) {
    return null;
  }

  return <span>{createBadge(result)}</span>;
}

export function PureProxy({ className = "" }) {
  return (
    <Tooltip
      content={
        <Link
          className="underline relative z-20"
          style={{ pointerEvents: "all" }}
          href="https://wiki.polkadot.network/learn/learn-proxies-pure/"
          target="_blank"
        >
          Pure Proxy↗
        </Link>
      }
      className={className}
    >
      <span className="inline-block h-5 leading-5 bg-neutral200 text-textSecondary text12Medium px-2 rounded-[0.625rem]">
        Pure
      </span>
    </Tooltip>
  );
}

export function DynamicPureProxy({ address }) {
  const { isPure, loading } = useIsPureProxy(address);

  if (!isPure || loading) {
    return null;
  }

  return <PureProxy />;
}

export function createRelationship({
  rootNode,
  items = [],
  nodeIdPrefix,
  edgeIdPrefix,
  nodeDataMapper,
  edgeDataMapper,
  sourceKey = rootNodeId,
  targetKey = "node",
  sourceHandle,
  targetHandle,
}) {
  const nodes = [];
  const edges = [];

  if (!rootNode || items.length === 0) {
    return { nodes, edges };
  }

  items.forEach((item, index) => {
    nodes.push({
      id: `${nodeIdPrefix}-${index}`,
      sourcePosition: "right",
      targetPosition: "left",
      type: "user",
      data: nodeDataMapper(item),
      width: nodeInitialWidth,
      height: nodeInitialHeight,
    });
  });

  nodes.forEach((node, index) => {
    edges.push({
      id: `${edgeIdPrefix}-${index}`,
      source: sourceKey === rootNodeId ? rootNode.id : node.id,
      target: targetKey === rootNodeId ? rootNode.id : node.id,
      type: "statusedge",
      data: edgeDataMapper(node.data),
      sourceHandle,
      targetHandle,
    });
  });

  return { nodes, edges };
}

export function createRootNode(address, multisigAddress) {
  return {
    id: rootNodeId,
    sourcePosition: "right",
    targetPosition: "left",
    type: "user",
    width: nodeInitialWidth,
    height: nodeInitialHeight,
    data: {
      address,
      badge: createBadge(multisigAddress.result),
    },
  };
}

export const EMPTY_RESULT = {
  isLoading: false,
  nodes: [],
  edges: [],
};
