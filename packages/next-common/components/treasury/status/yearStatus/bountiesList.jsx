import normalizeTreasuryBountyListItem from "next-common/utils/viewfuncs/treasury/normalizeBountyListItem";
import TreasuryItemsList from "./treasuryItemsList";

export default function BountiesList({ bounties = [] }) {
  return (
    <TreasuryItemsList
      items={bounties}
      getIndex={(bounty) => bounty.bountyIndex}
      apiPath="/treasury/bounties"
      normalizeItem={normalizeTreasuryBountyListItem}
    />
  );
}
