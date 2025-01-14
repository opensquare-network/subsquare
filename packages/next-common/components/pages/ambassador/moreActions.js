import BumpFellowshipMemberPopup from "next-common/components/collectives/core/actions/bump/popup";
import ActivationPopup from "next-common/components/collectives/core/actions/more/activationItem/popup";
import SubmitEvidencePopup from "next-common/components/collectives/core/actions/more/submitEvidenceItem/popup";
import { useState } from "react";
import {
  ActivationMenuItem,
  BumpMenuItem,
  MoreActionsWrapper,
  SubmitEvidenceMenuItem,
} from "../fellowship/moreActions";

export default function MoreActions({ member }) {
  const { address } = member || {};

  const [showBumpPopup, setShowBumpPopup] = useState(false);
  const [showSubmitEvidencePopup, setShowSubmitEvidencePopup] = useState(false);
  const [showActivationPopup, setShowActivationPopup] = useState(false);

  return (
    <>
      <MoreActionsWrapper>
        <BumpMenuItem member={member} setShowBumpPopup={setShowBumpPopup} />
        <SubmitEvidenceMenuItem
          member={member}
          setShowSubmitEvidencePopup={setShowSubmitEvidencePopup}
        />
        <ActivationMenuItem
          member={member}
          setShowActivationPopup={setShowActivationPopup}
        />
      </MoreActionsWrapper>
      {showBumpPopup && (
        <BumpFellowshipMemberPopup
          who={address}
          onClose={() => setShowBumpPopup(false)}
        />
      )}
      {showActivationPopup && (
        <ActivationPopup
          member={member}
          who={member.address}
          onClose={() => {
            setShowActivationPopup(false);
          }}
        />
      )}
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
