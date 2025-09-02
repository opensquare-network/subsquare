import { RELATIONSHIP_NODE_TYPE } from "next-common/utils/constants";
import pluralize from "pluralize";
import useMaybeContextMultisigAddress from "./useMaybeContextMultisigAddress";
import useDelegated, { useDelegators } from "./useRelativesDelegators";
import {
  BadgeInfo,
  createRootNode,
  createRelationship,
  EMPTY_RESULT,
  rootNodeId,
} from "./useRelationshipNode";

function createDelegatorsRelationship(rootNode, delegators = []) {
  return createRelationship({
    rootNode,
    items: delegators,
    nodeIdPrefix: "delegators",
    edgeIdPrefix: "root-delegators",
    nodeDataMapper: (item) => ({
      tracks: item.tracks,
      address: item.account,
      badge: <BadgeInfo address={item.account} />,
    }),
    edgeDataMapper: (item) => ({
      type: RELATIONSHIP_NODE_TYPE.Delegator,
      value: `${item.tracks.size} ${pluralize("track", item.tracks.size)}`,
      name: "Delegator",
      tracks: item.tracks,
    }),
    sourceKey: "node",
    targetKey: rootNodeId,
    sourceHandle: "sourceSub",
    targetHandle: "targetParent",
  });
}

function createDelegatedRelationship(rootNode, delegated = []) {
  return createRelationship({
    rootNode,
    items: delegated,
    nodeIdPrefix: "delegated",
    edgeIdPrefix: "root-delegated",
    nodeDataMapper: (item) => ({
      tracks: item.tracks,
      address: item.account,
      badge: <BadgeInfo address={item.account} />,
    }),
    edgeDataMapper: (item) => ({
      type: RELATIONSHIP_NODE_TYPE.Delegated,
      value: `${item.tracks.size} ${pluralize("track", item.tracks.size)}`,
      name: "Delegated",
      tracks: item.tracks,
    }),
    sourceKey: rootNodeId,
    targetKey: "node",
    sourceHandle: "sourceSub",
    targetHandle: "targetParent",
  });
}

export default function useDelegatorsRelationshipNode(sourceAddress = "") {
  const { result: delegators, loading: delegatorsLoading } =
    useDelegators(sourceAddress);

  const { result: delegated, loading: delegatedLoading } =
    useDelegated(sourceAddress);

  const isLoading = delegatorsLoading || delegatedLoading;

  const multisigAddress = useMaybeContextMultisigAddress(sourceAddress);
  const rootNode = createRootNode(sourceAddress, multisigAddress);

  if (!sourceAddress) {
    return EMPTY_RESULT;
  }

  const { nodes: delegatorsNodes, edges: delegatorsEdges } =
    createDelegatorsRelationship(rootNode, delegators);

  const { nodes: delegatedNodes, edges: delegatedEdges } =
    createDelegatedRelationship(rootNode, delegated);

  return {
    isLoading,
    nodes: [rootNode, ...delegatorsNodes, ...delegatedNodes],
    edges: [...delegatorsEdges, ...delegatedEdges],
  };
}
