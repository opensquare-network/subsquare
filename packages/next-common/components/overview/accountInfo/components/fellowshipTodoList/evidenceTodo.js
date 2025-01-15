import useSubCoreFellowshipEvidence from "next-common/hooks/collectives/useSubCoreFellowshipEvidence";
import useMemberData from "../../hook/useMemberData";
import { useDemotionPeriodCheck } from "../collectivesDemotionPrompt";
import TodoTag from "./todoTag";
import { useCollectivesApi } from "next-common/context/collectives/api";
import useRealAddress from "next-common/utils/hooks/useRealAddress";
import {
  useCollectivesSection,
  useCoreFellowshipPallet,
} from "next-common/context/collectives/collectives";
import ClickableText from "./clickableText";
import { useState } from "react";
import SubmitEvidencePopup from "next-common/components/collectives/core/actions/more/submitEvidenceItem/popup";

function RetentionEvidenceSubmission() {
  const [showSubmitEvidencePopup, setShowSubmitEvidencePopup] = useState(false);
  return (
    <>
      <div className="flex items-center">
        <TodoTag>Membership</TodoTag>
        <div className="text-textPrimary text14Medium">
          Your demotion period of membership is closing.{" "}
          <ClickableText onClick={() => setShowSubmitEvidencePopup(true)}>
            Submit your evidence
          </ClickableText>{" "}
          for retention
        </div>
      </div>
      {showSubmitEvidencePopup && (
        <SubmitEvidencePopup
          onClose={() => {
            setShowSubmitEvidencePopup(false);
          }}
        />
      )}
    </>
  );
}

function DemotionRetentionReferendaTodo() {
  // TODO: check if referenda created
}

function DemotionRetentionTodo() {
  const address = useRealAddress();
  const pallet = useCoreFellowshipPallet();
  const api = useCollectivesApi();
  const { loading, wish, evidence } = useSubCoreFellowshipEvidence(
    address,
    pallet,
    api,
  );

  if (loading) {
    return null;
  }

  if (wish?.toLowerCase() === "retention" && evidence) {
    return <DemotionRetentionReferendaTodo wish={wish} evidence={evidence} />;
  }

  return <RetentionEvidenceSubmission />;
}

function DemotionExpiringTodo({ collectiveMember, coreMember, coreParams }) {
  const { isDemotionExpiring } = useDemotionPeriodCheck({
    lastProof: coreMember?.lastProof,
    rank: collectiveMember?.rank,
    params: coreParams,
  });

  if (!isDemotionExpiring) {
    return null;
  }

  return <DemotionRetentionTodo />;
}

export default function EvidenceTodo() {
  const collectivesApi = useCollectivesApi();
  const { section } = useCollectivesSection();
  const { data, isLoading } = useMemberData(section, collectivesApi);
  if (isLoading) {
    return null;
  }

  const { collectiveMember, coreMember, coreParams } = data;

  if (!collectiveMember || !coreMember || !coreParams) {
    return null;
  }

  return (
    <DemotionExpiringTodo
      collectiveMember={collectiveMember}
      coreMember={coreMember}
      coreParams={coreParams}
    />
  );
}
