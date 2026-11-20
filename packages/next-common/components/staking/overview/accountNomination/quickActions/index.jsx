import BondButton from "./bondButton";
import UnBondButton from "./unBondButton";
import PayeeButton from "./payeeButton";
import StopNominationButton from "./stopNominationButton";
import ModifyNomineesButton from "../modifyNomineesButton";

export default function NominatorQuickActions({ hasNominations }) {
  return (
    <div className="flex flex-col gap-[12px]">
      <div className="flex gap-[16px] items-center">
        <BondButton />
        <UnBondButton />
        <PayeeButton />
        {hasNominations && <StopNominationButton />}
        <ModifyNomineesButton startNominating={!hasNominations} />
      </div>
    </div>
  );
}
