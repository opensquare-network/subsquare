import BondButton from "./bondButton";
import ClaimButton from "./claimButton";
import UnBondButton from "./unBondButton";
import PayeeButton from "./payeeButton";
import StopNominationButton from "./stopNominationButton";
import useRealAddress from "next-common/utils/hooks/useRealAddress";
import CheckNomineesButton from "../checkNomineesButton";

export default function NominatorQuickActions() {
  const realAddress = useRealAddress();
  return (
    <div className="flex flex-col gap-[12px]">
      <div className="flex gap-[16px] items-center">
        <ClaimButton />
        <BondButton />
        <UnBondButton />
        <PayeeButton />
        <StopNominationButton />
        <CheckNomineesButton nominator={realAddress} />
      </div>
    </div>
  );
}
