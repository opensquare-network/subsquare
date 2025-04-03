import { MapDataList } from "next-common/components/dataList";
import PopupWithSigner from "next-common/components/popupWithSigner";
import {
  addressColumn,
  evidenceColumn,
  rankColumn,
  referendumColumn,
  voteRetainColumn,
} from "../memberPromotionPopup/columns";

const columnsDef = [
  rankColumn,
  addressColumn,
  evidenceColumn,
  referendumColumn,
  voteRetainColumn,
];

function MemberRetentionsContent({ retentions }) {
  return (
    <MapDataList
      data={retentions}
      columnsDef={columnsDef}
      noDataText="No retentions available"
    />
  );
}

export default function MemberRetentionPopup({ retentions, onClose }) {
  return (
    <PopupWithSigner title="Member Retention" onClose={onClose}>
      <MemberRetentionsContent retentions={retentions} />
    </PopupWithSigner>
  );
}
