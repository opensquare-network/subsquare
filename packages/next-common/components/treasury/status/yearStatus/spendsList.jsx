import normalizeTreasurySpendListItem from "next-common/utils/viewfuncs/treasury/normalizeTreasurySpendListItem";
import TreasuryItemsList from "./treasuryItemsList";

export default function SpendsList({ spends = [] }) {
  return (
    <TreasuryItemsList
      items={spends}
      getIndex={(spend) => spend.index}
      apiPath="/treasury/spends"
      normalizeItem={normalizeTreasurySpendListItem}
    />
  );
}
