import normalizeTreasuryChildBountyListItem from "next-common/utils/viewfuncs/treasury/normalizeChildBountyListItem";
import TreasuryItemsList from "./treasuryItemsList";

export default function ChildBountiesList({ childBounties = [] }) {
  return (
    <TreasuryItemsList
      items={childBounties}
      getIndex={(childBounty) =>
        `${childBounty.parentBountyId}-${childBounty.index}`
      }
      apiPath="/treasury/child-bounties"
      normalizeItem={normalizeTreasuryChildBountyListItem}
    />
  );
}
