import BondButton from "./bondButton";
import UnBondButton from "./unBondButton";
import PayeeButton from "./payeeButton";
import StopNominationButton from "./stopNominationButton";
import ModifyNomineesButton from "../modifyNomineesButton";

export default function NominatorQuickActions() {
  return (
    <div className="flex flex-col gap-[12px]">
      <div className="flex gap-[16px] items-center">
        <BondButton />
        <UnBondButton />
        <PayeeButton />
        <StopNominationButton />
        <ModifyNomineesButton />
      </div>
    </div>
  );
}
