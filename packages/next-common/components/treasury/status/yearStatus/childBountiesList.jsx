import normalizeTreasuryChildBountyListItem from "next-common/utils/viewfuncs/treasury/normalizeChildBountyListItem";
import TreasuryItemsList from "./treasuryItemsList";

export default function ChildBountiesList({ childBounties = [] }) {
  return (
    <TreasuryItemsList
      items={childBounties}
      getIndex={(childBounty) => {
        const { parentBountyId, index, blockHeight } = childBounty;
        return [parentBountyId, index, blockHeight].filter(Boolean).join("_");
      }}
      apiPath="/treasury/child-bounties"
      normalizeItem={normalizeTreasuryChildBountyListItem}
    />
  );
}
