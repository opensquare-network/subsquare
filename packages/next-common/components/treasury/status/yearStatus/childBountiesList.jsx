import normalizeTreasuryChildBountyListItem from "next-common/utils/viewfuncs/treasury/normalizeChildBountyListItem";
import TreasuryItemsList from "./treasuryItemsList";

export default function ChildBountiesList({ childBounties = [] }) {
  return (
    <TreasuryItemsList
      items={childBounties}
      getIndex={(childBounty) => {
        const { parentBountyId, index, blockHeight, hasSameParentAndIndex } =
          childBounty;
        const indexes = [parentBountyId, index];
        if (hasSameParentAndIndex) {
          indexes.push(blockHeight);
        }
        return indexes.join("_");
      }}
      apiPath="/treasury/child-bounties"
      normalizeItem={normalizeTreasuryChildBountyListItem}
    />
  );
}
