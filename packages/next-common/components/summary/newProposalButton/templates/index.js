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

  return (
    <div className="flex flex-col gap-[8px] mt-[24px]">
      <h6 className="text-textPrimary text14Bold">Quick Start</h6>
      <div className="flex flex-wrap gap-[8px]">{buttons}</div>
    </div>
  );
}
