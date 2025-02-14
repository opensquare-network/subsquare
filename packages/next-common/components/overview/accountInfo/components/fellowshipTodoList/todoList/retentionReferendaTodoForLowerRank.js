import TodoTag from "./todoTag";
import ClickableText from "./clickableText";
import { useContextMyEvidence } from "../context/myEvidence";
import { useState } from "react";
import { EvidenceDetailPopup } from "next-common/components/collectives/core/member/evidence";
import { useContextMyMemberData } from "../context/myMemberData";
import useRealAddress from "next-common/utils/hooks/useRealAddress";
import useShouldShowRetentionReferendaTodoForLowerRank from "../hooks/useShouldShowRetentionReferendaTodoForLowerRank";

export default function RetentionReferendaTodoForLowerRank() {
  const address = useRealAddress();
  const [showEvidenceDetailPopup, setShowEvidenceDetailPopup] = useState(false);
  const { evidence } = useContextMyEvidence();
  const { memberData } = useContextMyMemberData();
  const show = useShouldShowRetentionReferendaTodoForLowerRank();
  if (!show) {
    return null;
  }

  const { collectiveMember, coreMember } = memberData;
  const rank = collectiveMember?.rank;
  const isActive = coreMember?.isActive;
  const [wish, evidenceData] = evidence.toJSON();

  return (
    <>
      <div className="flex items-center">
        <TodoTag>Membership</TodoTag>
        <div className="text-textPrimary text14Medium">
          You have an on-chain{" "}
          <ClickableText onClick={() => setShowEvidenceDetailPopup(true)}>
            evidence
          </ClickableText>{" "}
          and you can contact{" "}
          <ClickableText onClick={() => {}}>eligible members</ClickableText>.
        </div>
      </div>
      {showEvidenceDetailPopup && (
        <EvidenceDetailPopup
          address={address}
          rank={rank}
          isActive={isActive}
          wish={wish}
          evidence={evidenceData}
          onClose={() => setShowEvidenceDetailPopup(false)}
        />
      )}
    </>
  );
}
