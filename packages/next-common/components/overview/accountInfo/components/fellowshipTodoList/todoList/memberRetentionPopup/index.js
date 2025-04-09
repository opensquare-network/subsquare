import { MapDataList } from "next-common/components/dataList";
import PopupWithSigner from "next-common/components/popupWithSigner";
import {
  addressColumn,
  evidenceColumn,
  rankColumn,
  referendumColumn,
  voteRetainColumn,
} from "../memberPromotionPopup/columns";
import ExtensionUpdatePrompt from "../../../extensionUpdatePrompt";

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
    <PopupWithSigner
      className="w-[800px]"
      title="Member Retention"
      onClose={onClose}
    >
      <ExtensionUpdatePrompt isWithCache={false} />
      <MemberRetentionsContent retentions={retentions} />
    </PopupWithSigner>
  );
}
