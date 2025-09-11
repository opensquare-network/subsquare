import PrimaryButton from "next-common/lib/button/primary";
import { SystemPlus } from "@osn/icons/subsquare";

export default function NewButton({ setShowPopup, disabled }) {
  return (
    <PrimaryButton
      size="small"
      disabled={disabled}
      iconLeft={<SystemPlus className="w-4 h-4" />}
      onClick={() => setShowPopup(true)}
    >
      New Proposal
    </PrimaryButton>
  );
}
