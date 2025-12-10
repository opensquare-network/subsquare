import BondButton from "./bondButton";
import UnBondButton from "./unBondButton";
import PayeeButton from "./payeeButton";
import StopNominationButton from "./stopNominationButton";

export default function NominatorQuickActions() {
  return (
    <div className="flex gap-[16px] items-center">
      <BondButton />
      <UnBondButton />
      <PayeeButton />
      <StopNominationButton />
    </div>
  );
}
