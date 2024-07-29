import { QuickStart } from "next-common/components/preImages/createPreimagePopup";
import { useNewRemarkButton } from "./newRemark";
import { useSpendLocalButton } from "./spendLocal";
import { useSpendUSDxButton } from "./spendUSDx";

export default function ReferendumTemplates() {
  const spendLocalButton = useSpendLocalButton();
  const spendUSDxButton = useSpendUSDxButton();
  const newRemarkButton = useNewRemarkButton();

  const buttons = [spendLocalButton, spendUSDxButton, newRemarkButton].filter(
    Boolean,
  );

  if (buttons.length === 0) {
    return null;
  }

  return <QuickStart>{buttons}</QuickStart>;
}
