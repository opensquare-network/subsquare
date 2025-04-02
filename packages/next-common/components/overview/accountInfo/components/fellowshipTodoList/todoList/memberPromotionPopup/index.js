import { MapDataList } from "next-common/components/dataList";
import PopupWithSigner from "next-common/components/popupWithSigner";
import {
  addressColumn,
  evidenceColumn,
  rankColumn,
  referendumColumn,
  voteColumn,
} from "./columns";

const columnsDef = [
  rankColumn,
  addressColumn,
  evidenceColumn,
  referendumColumn,
  voteColumn,
];

function MemberPromotionContent({ promotions }) {
  return (
    <MapDataList
      data={promotions}
      columnsDef={columnsDef}
      noDataText="No promotions available"
    />
  );
}

export default function MemberPromotionPopup({ promotions, onClose }) {
  return (
    <PopupWithSigner title="Member Promotion" onClose={onClose}>
      <MemberPromotionContent promotions={promotions} />
    </PopupWithSigner>
  );
}
