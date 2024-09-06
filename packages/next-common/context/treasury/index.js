import { createContext, useContext } from "react";

const TreasuryContext = createContext();

export function TreasuryProvider({ pallet = "treasury", children }) {
  return (
    <TreasuryContext.Provider value={{ pallet }}>
      {children}
    </TreasuryContext.Provider>
  );
}

export function useTreasuryPallet() {
  const { pallet } = useContext(TreasuryContext) || {};
  return pallet;
}

export function useTreasuryProposalListUrl(pallet) {
  return "communityTreasury" === pallet
    ? "/community-treasury/proposals"
    : "/treasury/proposals";
}
