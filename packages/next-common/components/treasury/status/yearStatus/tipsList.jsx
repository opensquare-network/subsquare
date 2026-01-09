import { tipColumnsDef } from "../../projects/projectDetailPopup/columns";
import { normalizeTips } from "../../projects/hooks/usePopupDetailTabs";
import normalizeTipListItem from "next-common/utils/viewfuncs/treasury/normalizeTipListItem";
import TreasuryItemsList from "./treasuryItemsList";

export default function TipsList({ tips = [] }) {
  return (
    <TreasuryItemsList
      items={tips}
      getIndex={(tip) => tip.hash}
      apiPath="/treasury/tips"
      normalizeItem={normalizeTipListItem}
      normalize={normalizeTips}
      columnsDef={tipColumnsDef}
    />
  );
}
