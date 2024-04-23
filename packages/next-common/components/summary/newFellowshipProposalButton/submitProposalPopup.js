import { useState } from "react";
import NewFellowshipProposalPopup from "../newFellowshipProposalPopup";
import SubmitProposalPopupCommon from "../newProposalButton/common";
import { ArrowRight } from "@osn/icons/subsquare";
import { cn } from "../../../utils";
import { usePageProps } from "next-common/context/page";

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

export default function SubmitFellowshipProposalPopup({ onClose }) {
  const { period } = usePageProps();
  const [preimageHash, setPreimageHash] = useState();
  const [preimageLength, setPreimageLength] = useState();

  return (
    <SubmitProposalPopupCommon
      setPreimageHash={setPreimageHash}
      setPreimageLength={setPreimageLength}
      onClose={onClose}
      newProposalPopup={
        <NewFellowshipProposalPopup
          track={period}
          onClose={onClose}
          preimageHash={preimageHash}
          preimageLength={preimageLength}
        />
      }
    >
      <div className="flex flex-col gap-[8px]">
        <h6 className="text-textPrimary text14Bold">Quick Start</h6>
        <div className="flex flex-wrap">
          <QuickStartButton title="Promote a fellowship member" />
        </div>
      </div>
    </SubmitProposalPopupCommon>
  );
}
