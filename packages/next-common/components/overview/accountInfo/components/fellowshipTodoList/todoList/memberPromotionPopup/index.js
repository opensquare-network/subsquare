import { MapDataList } from "next-common/components/dataList";
import PopupWithSigner from "next-common/components/popupWithSigner";
import {
  addressColumn,
  evidenceColumn,
  rankColumn,
  referendumColumn,
  votePromoteColumn,
} from "./columns";
import ExtensionUpdatePrompt from "../../../extensionUpdatePrompt";

const columnsDef = [
  rankColumn,
  addressColumn,
  evidenceColumn,
  referendumColumn,
  votePromoteColumn,
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
    <PopupWithSigner
      className="w-[800px]"
      title="Member Promotion"
      onClose={onClose}
    >
      <ExtensionUpdatePrompt isWithCache={false} />
      <MemberPromotionContent promotions={promotions} />
    </PopupWithSigner>
  );
}
