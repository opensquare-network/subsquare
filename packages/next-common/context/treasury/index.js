import { createContext, useContext } from "react";

const TreasuryContext = createContext();
const defaultPallet = "treasury";

export function TreasuryProvider({ pallet = defaultPallet, children }) {
  return (
    <TreasuryContext.Provider value={{ pallet }}>
      {children}
    </TreasuryContext.Provider>
  );
}

export function useTreasuryPallet() {
  const { pallet } = useContext(TreasuryContext) || {};
  if (!pallet) {
    throw new Error(`No treasury provider set when useTreasuryPallet`);
  }

  return pallet;
}

export function useTreasuryProposalListUrl(pallet) {
  return "communityTreasury" === pallet
    ? "/community-treasury/proposals"
    : "/treasury/proposals";
}
