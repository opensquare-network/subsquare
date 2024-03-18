import PrimaryButton from "next-common/lib/button/primary";
import { SystemPlus } from "@osn/icons/subsquare";

export default function NewButton({ setShowPopup }) {
  return (
    <PrimaryButton
      size="small"
      iconLeft={<SystemPlus className="w-4 h-4" />}
      onClick={() => setShowPopup(true)}
    >
      New Proposal
    </PrimaryButton>
  );
}
