import { createContext, useContext } from "react";

const CollectiveContext = createContext({});

export default function CollectiveProvider({
  children,
  pallet = collectivePallets.council,
}) {
  return (
    <CollectiveContext.Provider value={{ pallet }}>
      {children}
    </CollectiveContext.Provider>
  );
}

export function useCollectiveContext() {
  return useContext(CollectiveContext);
}

export function useCollectivePallet() {
  const { pallet } = useCollectiveContext();
  return pallet;
}

export const collectivePallets = Object.freeze({
  openTechCommitteeCollective: "openTechCommitteeCollective", // moonriver
  advisoryCommittee: "advisoryCommittee", // zeitgeist
  allianceMotion: "allianceMotion",
  communityCouncil: "communityCouncil", // astar and shibuya
  financialCouncil: "financialCouncil", // acala and karura
  generalCouncil: "generalCouncil", // acala and karura, same as council in other chains
  technicalCommittee: "technicalCommittee",
  treasuryCouncilCollective: "treasuryCouncilCollective", // moonriver
  council: "council",
});
