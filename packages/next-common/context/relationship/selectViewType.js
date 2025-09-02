import { createContext, useContext, useState } from "react";

export const VIEW_TYPE = {
  COMMON: "common",
  DELEGATION: "delegation",
};

export const RelationshipViewTypeContext = createContext();

export default function RelationshipViewTypeProvider({ children }) {
  const [viewType, setViewType] = useState(VIEW_TYPE.COMMON);

  return (
    <RelationshipViewTypeContext.Provider value={{ viewType, setViewType }}>
      {children}
    </RelationshipViewTypeContext.Provider>
  );
}

export function useRelationshipViewTypeState() {
  const { viewType, setViewType } =
    useContext(RelationshipViewTypeContext) || {};
  return { viewType, setViewType };
}
