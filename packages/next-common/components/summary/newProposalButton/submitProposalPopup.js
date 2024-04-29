import { useState } from "react";
import NewProposalPopup from "../newProposalPopup";
import { usePageProps } from "next-common/context/page";
import SubmitProposalPopupCommon from "./common";
import { ArrowRight } from "@osn/icons/subsquare";
import { cn } from "../../../utils";
import CreateTreasuryProposalPopup from "../newProposalQuickStart/createTreasuryProposalPopup";
import { useChainSettings } from "next-common/context/chain";

function QuickStartButton({ title, onClick }) {
  return (
    <div
      className={cn(
        "flex items-center pl-[16px] py-[10px] pr-[10px] gap-[8px]",
        "cursor-pointer rounded-full border border-neutral400 hover:border-neutral500",
      )}
      onClick={onClick}
    >
      <span className="text-textPrimary text14Medium">{title}</span>
      <div className="inline-flex">
        <ArrowRight
          className="[&_path]:stroke-textTertiary"
          width={20}
          height={20}
        />
      </div>
    </div>
  );
}

export default function SubmitProposalPopup({ onClose }) {
  const { period } = usePageProps();
  const [preimageHash, setPreimageHash] = useState();
  const [preimageLength, setPreimageLength] = useState();
  const [showCreateTreasuryProposal, setShowCreateTreasuryProposal] =
    useState(false);
  const settings = useChainSettings();

  if (showCreateTreasuryProposal) {
    return <CreateTreasuryProposalPopup onClose={onClose} />;
  }

  const quickStartButtons = [];

  if (settings.treasuryProposalTracks) {
    quickStartButtons.push(
      <QuickStartButton
        key="treasury-proposal"
        title="Create a treasury proposal"
        onClick={() => setShowCreateTreasuryProposal(true)}
      />,
    );
  }

  return (
    <SubmitProposalPopupCommon
      setPreimageHash={setPreimageHash}
      setPreimageLength={setPreimageLength}
      onClose={onClose}
      newProposalPopup={
        <NewProposalPopup
          track={period}
          onClose={onClose}
          preimageHash={preimageHash}
          preimageLength={preimageLength}
        />
      }
    >
      {quickStartButtons?.length > 0 && (
        <div className="flex flex-col gap-[8px] mt-[24px]">
          <h6 className="text-textPrimary text14Bold">Quick Start</h6>
          <div className="flex flex-wrap">{quickStartButtons}</div>
        </div>
      )}
    </SubmitProposalPopupCommon>
  );
}
