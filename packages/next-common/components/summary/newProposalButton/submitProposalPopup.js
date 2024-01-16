import Popup from "next-common/components/popup/wrapper/Popup";
import NewPreimageSVG from "./icons/new-preimage.svg";
import NewProposalSVG from "./icons/new-proposal.svg";
import { ArrowRight } from "@osn/icons/subsquare";
import { cn } from "next-common/utils";
import { useState } from "react";
import NewPreimagePopup from "next-common/components/preImages/newPreimagePopup";
import NewProposalPopup from "../newProposalPopup";

function ChoiceButton({ icon, name, description, onClick }) {
  return (
    <div
      className={cn(
        "flex items-center justify-center",
        "rounded-[8px] border border-neutral400 cursor-pointer hover:border-neutral500",
      )}
      onClick={onClick}
    >
      <div className="flex items-center grow">
        <div className="p-[12px]">{icon}</div>
        <div>
          <div className="text14Medium text-textPrimary">{name}</div>
          <div className="text12Medium text-textTertiary">{description}</div>
        </div>
      </div>
      <div className="p-[10px] [&_svg_path]:stroke-textTertiary">
        <ArrowRight />
      </div>
    </div>
  );
}

export default function SubmitProposalPopup({ onClose }) {
  const [showNewPreimagePopup, setShowNewPreimagePopup] = useState(false);
  const [showNewProposalPopup, setShowNewProposalPopup] = useState(false);

  if (showNewPreimagePopup) {
    return <NewPreimagePopup onClose={onClose} />;
  }

  if (showNewProposalPopup) {
    return <NewProposalPopup onClose={onClose} />;
  }

  return (
    <Popup wide title="Submit Proposal" onClose={onClose}>
      <ChoiceButton
        icon={<NewPreimageSVG />}
        name="New preimage"
        description="Proposals can be submitted with preimage hash-only"
        onClick={() => setShowNewPreimagePopup(true)}
      />
      <ChoiceButton
        icon={<NewProposalSVG />}
        name="I already have a preimage"
        description="Copy preimage hash to continue submitting a proposal"
        onClick={() => setShowNewProposalPopup(true)}
      />
    </Popup>
  );
}
