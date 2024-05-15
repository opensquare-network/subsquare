import { useChainSettings } from "next-common/context/chain";
import SpendLocalTemplate from "next-common/components/summary/newProposalButton/templates/spendLocal";

export default function ReferendumTemplates({ onClose }) {
  const settings = useChainSettings();
  if (!settings.treasuryProposalTracks) {
    return null;
  }

  return (
    <div className="flex flex-col gap-[8px] mt-[24px]">
      <h6 className="text-textPrimary text14Bold">Quick Start</h6>
      <div className="flex flex-wrap">
        <SpendLocalTemplate onClose={onClose} />
      </div>
    </div>
  );
}
