import BondButton from "./bondButton";
import ClaimButton from "./claimButton";
import UnBondButton from "./unBondButton";
import PayeeButton from "./payeeButton";

export default function NominatorQuickActions() {
  return (
    <div className="flex gap-[16px] items-center">
      <ClaimButton />
      <BondButton />
      <UnBondButton />
      <PayeeButton />
    </div>
  );
}
