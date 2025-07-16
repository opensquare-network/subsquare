import { noop } from "lodash-es";
import React, {
  createContext,
  useCallback,
  useContext,
  useMemo,
  useState,
} from "react";
import { rootNodeId } from "next-common/hooks/useConversionRelationshipNode";

const defaultContext = {
  nodes: [],
  edges: [],
  isLoading: false,
  excludedIndications: [],
  setExcludedIndications: noop,
};

const RelationshipContext = createContext(defaultContext);

export default function RelationshipProvider({
  children,
  nodes,
  edges,
  isLoading,
}) {
  const [excludedIndications, setExcludedIndications] = useState(
    defaultContext.excludedIndications,
  );
  const value = useMemo(
    () => ({
      nodes,
      edges,
      isLoading,
      excludedIndications,
      setExcludedIndications,
    }),
    [nodes, edges, isLoading, excludedIndications, setExcludedIndications],
  );

  return (
    <RelationshipContext.Provider value={value}>
      {children}
    </RelationshipContext.Provider>
  );
}

export function useRelationshipNodes() {
  const context = useContext(RelationshipContext);
  if (!context) {
    throw new Error(
      "useRelationshipNodes must be used within a RelationshipProvider",
    );
  }

  const relationshipsByType = useMemo(() => {
    const nodesByType = {};

    for (const edge of context.edges) {
      const relationType = edge?.data?.type;
      const sourceId = edge?.source;
      const targetId = edge?.target;

      if (!relationType || !sourceId || !targetId) {
        continue;
      }

      const isSourceRoot = sourceId === rootNodeId;
      const connectedNodeId = isSourceRoot ? targetId : sourceId;

      nodesByType[relationType] = [
        ...(nodesByType[relationType] || []),
        connectedNodeId,
      ];
    }

    return nodesByType;
  }, [context.edges]);

  const hiddenNodesIds = useMemo(() => {
    const excludedNodeIds = [];

    for (const indicationType of context.excludedIndications) {
      const nodesOfType = relationshipsByType[indicationType] || [];

      for (const nodeId of nodesOfType) {
        if (!excludedNodeIds.includes(nodeId)) {
          excludedNodeIds.push(nodeId);
        }
      }
    }

    return excludedNodeIds;
  }, [relationshipsByType, context.excludedIndications]);

  return {
    nodes: context.nodes
      .map((item) => {
        return {
          ...item,
          hidden: hiddenNodesIds.includes(item.id),
        };
      })
      .filter((item) => !item.hidden),
    edges: context.edges.filter((edge) => {
      return (
        !hiddenNodesIds.includes(edge.source) &&
        !hiddenNodesIds.includes(edge.target)
      );
    }),
    isLoading: context.isLoading,
  };
}

export function useSwitchIndications() {
  const context = useContext(RelationshipContext);
  if (!context) {
    throw new Error(
      "useSwitchIndications must be used within a RelationshipProvider",
    );
  }

  const { excludedIndications, setExcludedIndications } = context;

  const toggleIndication = useCallback(
    (indication) => {
      setExcludedIndications((prev) => {
        if (prev.includes(indication)) {
          return prev.filter((item) => item !== indication);
        }
        return [...prev, indication];
      });
    },
    [setExcludedIndications],
  );

  return {
    excludedIndications,
    setExcludedIndications,
    toggleIndication,
  };
}
