import useFetchProfileProxies from "next-common/hooks/profile/useFetchProfileProxies";
import useSignatoryMultisig from "next-common/hooks/useSignatoryMultisig";
import { RELATIONSHIP_NODE_TYPE } from "next-common/utils/constants";
import useFetchIdentityInfo from "next-common/hooks/useFetchIdentityInfo";
import useMaybeContextMultisigAddress from "./useMaybeContextMultisigAddress";
import {
  rootNodeId,
  createRelationship,
  BadgeInfo,
  createBadge,
  createRootNode,
  DynamicPureProxy,
  EMPTY_RESULT,
} from "./useRelationshipNode";

function createProxiesRelationship(rootNode, proxies = []) {
  return createRelationship({
    rootNode,
    items: proxies,
    nodeIdPrefix: "proxie",
    edgeIdPrefix: "root-proxies",
    nodeDataMapper: (item) => {
      if (rootNode?.data?.address === item.delegator) {
        rootNode.data.pure = (
          <DynamicPureProxy
            address={item.delegator}
            className="inline-flex absolute h-5 right-2 top-2"
          />
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
      pure: <DynamicPureProxy address={item.delegator} />,
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

export default function useCommonRelationshipNode(sourceAddress = "") {
  const proxies = useFetchProfileProxies({
    delegator: sourceAddress,
    pageSize: 100,
  });
  const receivedProxies = useFetchProfileProxies({
    delegatee: sourceAddress,
    pageSize: 100,
  });

  const multisigAddress = useMaybeContextMultisigAddress(sourceAddress);
  const signatoryMultisig = useSignatoryMultisig(sourceAddress);
  const identityInfo = useFetchIdentityInfo(sourceAddress);

  const isLoading =
    proxies.isLoading ||
    receivedProxies.isLoading ||
    multisigAddress.loading ||
    signatoryMultisig.loading ||
    identityInfo.isLoading;

  const rootNode = createRootNode(sourceAddress, multisigAddress);

  if (!sourceAddress) {
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
