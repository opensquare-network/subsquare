import useFetchProfileProxies, {
  useIsPureProxy,
} from "next-common/hooks/profile/useFetchProfileProxies";
import useMultisigAddress from "next-common/hooks/useMultisigAddress";
import useSignatoryMultisig from "next-common/hooks/useSignatoryMultisig";
import { RELATIONSHIP_NODE_TYPE } from "next-common/utils/constants";
import useFetchIdentityInfo from "next-common/hooks/profile/useFetchIdentityInfo";
import Tooltip from "next-common/components/tooltip";
import Link from "next/link";

export const rootNodeId = "rootNode";
const nodeInitialWidth = 240;
const nodeInitialHeight = 80;

function createBadge(multisig) {
  let badge = "";
  if (multisig && multisig.signatories) {
    badge = `${multisig.threshold}/${multisig.signatories.length}`;
  }
  return badge;
}

function BadgeInfo({ address }) {
  const { result, loading } = useMultisigAddress(address);
  if (!result || loading) {
    return null;
  }

  return <span>{createBadge(result)}</span>;
}

function PureProxy({ className = "" }) {
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

function DynamicPureProxy({ address }) {
  const { isPure, loading } = useIsPureProxy(address);

  if (!isPure || loading) {
    return null;
  }

  return <PureProxy />;
}

function createRelationship({
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

function createProxiesRelationship(rootNode, proxies = []) {
  return createRelationship({
    rootNode,
    items: proxies,
    nodeIdPrefix: "proxie",
    edgeIdPrefix: "root-proxies",
    nodeDataMapper: (item) => {
      if (rootNode?.data?.address === item.delegator && item.isPure) {
        rootNode.data.pure = (
          <PureProxy className="inline-flex absolute h-5 right-2 top-2" />
        );
      }
      return {
        address: item.delegatee,
        value: item.type,
        badge: <BadgeInfo address={item.delegatee} />,
      };
    },
    edgeDataMapper: (data) => ({
      type: RELATIONSHIP_NODE_TYPE.Proxy,
      name: "Proxy",
      value: data.value,
    }),
    sourceKey: "node",
    targetKey: rootNodeId,
    sourceHandle: "sourceProxy",
    targetHandle: "targetProxy",
  });
}

function createReceivedProxiesRelationship(rootNode, receivedProxies = []) {
  return createRelationship({
    rootNode,
    items: receivedProxies,
    nodeIdPrefix: "receivedProxies",
    edgeIdPrefix: "root-receivedProxies",
    nodeDataMapper: (item) => ({
      address: item.delegator,
      value: item.type,
      badge: <BadgeInfo address={item.delegator} />,
      pure: <PureProxy />,
    }),
    edgeDataMapper: (data) => ({
      type: RELATIONSHIP_NODE_TYPE.Proxy,
      name: "Proxy",
      value: data.value,
    }),
    sourceKey: rootNodeId,
    targetKey: "node",
    sourceHandle: "sourceProxy",
    targetHandle: "targetProxy",
  });
}

function createMultisigAddressRelationship(rootNode, address = []) {
  return createRelationship({
    rootNode,
    items: address,
    nodeIdPrefix: "multisigAddress",
    edgeIdPrefix: "root-multisigAddress",
    nodeDataMapper: (item) => ({
      address: item,
      badge: <BadgeInfo address={item} />,
    }),
    edgeDataMapper: () => ({
      type: RELATIONSHIP_NODE_TYPE.Multisig,
      value: "Signatory",
      name: "Multisig",
    }),
    sourceKey: "node",
    targetKey: rootNodeId,
    sourceHandle: "sourceMultisig",
    targetHandle: "targetMultisig",
  });
}

function createSignatoryMultisigRelationship(rootNode, signatoryMultisig = []) {
  return createRelationship({
    rootNode,
    items: signatoryMultisig,
    nodeIdPrefix: "signatoryMultisig",
    edgeIdPrefix: "root-signatoryMultisig",
    nodeDataMapper: (item) => ({
      address: item.address,
      badge: createBadge(item),
    }),
    edgeDataMapper: () => ({
      type: RELATIONSHIP_NODE_TYPE.Multisig,
      value: "Signatory",
      name: "Multisig",
    }),
    sourceKey: rootNodeId,
    targetKey: "node",
    sourceHandle: "sourceMultisig",
    targetHandle: "targetMultisig",
  });
}

function createParentRelationship(rootNode, parent = null) {
  const address = parent ? [parent] : [];

  return createRelationship({
    rootNode,
    items: address,
    nodeIdPrefix: "primaryAccount",
    edgeIdPrefix: "root-primaryAccount",
    nodeDataMapper: (item) => ({
      address: item,
      badge: <BadgeInfo address={item} />,
      pure: <DynamicPureProxy address={item} />,
    }),
    edgeDataMapper: () => ({
      type: RELATIONSHIP_NODE_TYPE.Identity,
      value: "Parent",
      name: "Identity",
    }),
    sourceKey: "node",
    targetKey: rootNodeId,
    sourceHandle: "sourceSub",
    targetHandle: "targetParent",
  });
}

function createSubRelationship(rootNode, subs = []) {
  const address = subs?.[1] || [];

  return createRelationship({
    rootNode,
    items: address,
    nodeIdPrefix: "subsAccount",
    edgeIdPrefix: "root-subsAccount",
    nodeDataMapper: (item) => ({
      address: item,
      badge: <BadgeInfo address={item} />,
      pure: <DynamicPureProxy address={item} />,
    }),
    edgeDataMapper: () => ({
      type: RELATIONSHIP_NODE_TYPE.Identity,
      value: "Sub",
      name: "Identity",
    }),
    sourceKey: rootNodeId,
    targetKey: "node",
    sourceHandle: "sourceSub",
    targetHandle: "targetParent",
  });
}

function createRootNode(address, multisigAddress) {
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

const EMPTY_RESULT = {
  isLoading: false,
  nodes: [],
  edges: [],
};

export default function useConversionRelationshipNode(rootAddress = "") {
  const proxies = useFetchProfileProxies({
    delegator: rootAddress,
    pageSize: 100,
  });
  const receivedProxies = useFetchProfileProxies({
    delegatee: rootAddress,
    pageSize: 100,
  });
  const multisigAddress = useMultisigAddress(rootAddress);
  const signatoryMultisig = useSignatoryMultisig(rootAddress);
  const identityInfo = useFetchIdentityInfo();

  const isLoading =
    proxies.isLoading ||
    receivedProxies.isLoading ||
    multisigAddress.loading ||
    signatoryMultisig.loading ||
    identityInfo.isLoading;

  const rootNode = createRootNode(rootAddress, multisigAddress);

  if (!rootAddress) {
    return EMPTY_RESULT;
  }

  const { nodes: proxiesNodes, edges: proxiesEdges } =
    createProxiesRelationship(rootNode, proxies.data?.items);
  const { nodes: receivedproxiesNodes, edges: receivedProxiesEdges } =
    createReceivedProxiesRelationship(rootNode, receivedProxies.data?.items);
  const { nodes: multisigNodes, edges: multisigEdges } =
    createMultisigAddressRelationship(
      rootNode,
      multisigAddress.result?.signatories,
    );
  const { nodes: signatoriesNodes, edges: signatoriesEdges } =
    createSignatoryMultisigRelationship(
      rootNode,
      signatoryMultisig.result?.multisigAddresses,
    );

  const { nodes: parentNodes, edges: parentEdges } = createParentRelationship(
    rootNode,
    identityInfo?.data?.info?.parent,
  );

  const { nodes: subNodes, edges: subEdges } = createSubRelationship(
    rootNode,
    identityInfo?.data?.subs,
  );

  return {
    isLoading,
    nodes: [
      rootNode,
      ...proxiesNodes,
      ...receivedproxiesNodes,
      ...multisigNodes,
      ...signatoriesNodes,
      ...parentNodes,
      ...subNodes,
    ],
    edges: [
      ...proxiesEdges,
      ...receivedProxiesEdges,
      ...multisigEdges,
      ...signatoriesEdges,
      ...parentEdges,
      ...subEdges,
    ],
  };
}
