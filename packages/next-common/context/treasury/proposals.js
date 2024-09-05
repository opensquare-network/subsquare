import { createContext, useContext } from "react";

const ProposalsContext = createContext();

export function ProposalsProvider({ section = "treasury", params, children }) {
  return (
    <ProposalsContext.Provider value={{ section, params }}>
      {children}
    </ProposalsContext.Provider>
  );
}

export function useProposalsSection() {
  const { section } = useContext(ProposalsContext) || {};
  return section;
}

export function useProposalsParams() {
  const { params } = useContext(ProposalsContext) || {};
  return params;
}
