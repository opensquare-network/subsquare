import BondButton from "./bondButton";
import ClaimButton from "./claimButton";
import UnBondButton from "./unBondButton";
import PayeeButton from "./payeeButton";
import StopNominationButton from "./stopNominationButton";

export default function NominatorQuickActions() {
  return (
    <div className="flex flex-col gap-[12px]">
      <div className="flex gap-[16px] items-center">
        <ClaimButton />
        <BondButton />
        <UnBondButton />
        <PayeeButton />
        <StopNominationButton />
      </div>
    </div>
  );
}
