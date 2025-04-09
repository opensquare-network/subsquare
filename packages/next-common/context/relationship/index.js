import React, { createContext } from "react";
import { indications } from "next-common/components/relationshipPopup/indications";

const RelationshipContext = createContext({
  nodes: [],
  edges: [],
  isLoading: false,
  activeIndications: indications.map((item) => item.name),
});

export default function RelationshipProvider({
  children,
  nodes,
  edges,
  isLoading,
  activeIndications,
}) {
  return (
    <RelationshipContext.Provider
      value={{ nodes, edges, isLoading, activeIndications }}
    >
      {children}
    </RelationshipContext.Provider>
  );
}
