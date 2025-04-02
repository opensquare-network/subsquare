import {
  useFetchMyProfileProxies,
  useFetchReceivedProfileProxies,
} from "next-common/hooks/profile/useFetchProfileProxies";
import { useParams } from "next/navigation";
import useMultisigAddress from "next-common/hooks/useMultisigAddress";
import useSignatoryMultisig from "next-common/hooks/useSignatoryMultisig";
import { RELATIONSHIP_NODE_TYPE } from "next-common/utils/constants";

export const rootNodeId = "rootNode";

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
    nodeDataMapper: (item) => ({
      address: item.delegatee,
      value: item.type,
      isPure: item.isPure,
    }),
    edgeDataMapper: (data) => ({
      type: RELATIONSHIP_NODE_TYPE.Proxied,
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
      isPure: item.isPure,
    }),
    edgeDataMapper: (data) => ({
      type: RELATIONSHIP_NODE_TYPE.Received,
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
    }),
    edgeDataMapper: () => ({
      type: RELATIONSHIP_NODE_TYPE.Signatory,
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
    }),
    edgeDataMapper: () => ({
      type: RELATIONSHIP_NODE_TYPE.Signatory,
      value: "Signatory",
      name: "Multisig",
    }),
    sourceKey: rootNodeId,
    targetKey: "node",
    sourceHandle: "sourceMultisig",
    targetHandle: "targetMultisig",
  });
}

function createRootNode(address, multisigAddress) {
  let badge = "";
  const multisigResult = multisigAddress.result;

  if (multisigResult) {
    badge = `${multisigResult.threshold}/${multisigResult.signatories.length}`;
  }

  return {
    id: rootNodeId,
    sourcePosition: "right",
    targetPosition: "left",
    type: "user",
    data: {
      address,
      badge,
    },
  };
}

export default function useConversionRelationshipNode() {
  const { params } = useParams();
  const [address] = params ?? {};
  const proxies = useFetchMyProfileProxies();
  const receivedProxies = useFetchReceivedProfileProxies();
  const multisigAddress = useMultisigAddress(address);
  const signatoryMultisig = useSignatoryMultisig(address);

  const isLoading =
    proxies.isLoading ||
    receivedProxies.isLoading ||
    multisigAddress.loading ||
    signatoryMultisig.loading;

  const rootNode = createRootNode(address, multisigAddress);

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

  return {
    isLoading,
    nodes: [
      rootNode,
      ...proxiesNodes,
      ...receivedproxiesNodes,
      ...multisigNodes,
      ...signatoriesNodes,
    ],
    edges: [
      ...proxiesEdges,
      ...receivedProxiesEdges,
      ...multisigEdges,
      ...signatoriesEdges,
    ],
  };
}
