import { extractTime } from "@polkadot/util";
import { has } from "lodash-es";
import { PromptTypes } from "next-common/components/scrollPrompt";
import { useChainSettings } from "next-common/context/chain";
import useMySalaryClaimant from "next-common/hooks/fellowship/salary/useMySalaryClaimant";
import useSalaryFellowshipPeriods from "next-common/hooks/fellowship/salary/useSalaryFellowshipPeriods";
import { useCalcPeriodBlocks } from "next-common/hooks/useCalcPeriodBlocks";
import { fellowshipSalaryStatusSelector } from "next-common/store/reducers/fellowship/salary";
import Link from "next/link";
import { useSelector } from "react-redux";
import Prompt from "../prompt";
import { ambassadorSalaryStatusSelector } from "next-common/store/reducers/ambassador/salary";

export default function CollectivesSalaryRegisterWarning({
  section,
  memberData,
}) {
  let statusSelector = null;
  if (section === "fellowship") {
    statusSelector = fellowshipSalaryStatusSelector;
  } else if (section === "ambassador") {
    statusSelector = ambassadorSalaryStatusSelector;
  }

  const stats = useSelector(statusSelector);
  const { cycleStart } = stats || {};

  const { claimant } = useMySalaryClaimant();
  const { blockTime } = useChainSettings();

  const notRegistered = has(claimant?.status, "nothing");

  const { registrationPeriod } = useSalaryFellowshipPeriods();
  const { remainBlocks } = useCalcPeriodBlocks(registrationPeriod, cycleStart);
  const ms = blockTime * remainBlocks;
  const { days } = extractTime(ms);
  const displayDays = days > 0 && days <= 3;

  if (!stats || !memberData?.coreMember || !notRegistered || !displayDays) {
    return null;
  }

  return (
    <Prompt expires={null} type={PromptTypes.WARNING}>
      The registration period of current salary cycle is about to expire.
      Register{" "}
      <Link
        className="underline"
        href={`${section}/salary/cycles/${stats.cycleIndex}`}
      >
        here
      </Link>
    </Prompt>
  );
}
