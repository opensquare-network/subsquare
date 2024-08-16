import { has, upperFirst } from "lodash-es";
import { PromptTypes } from "next-common/components/scrollPrompt";
import { useChainSettings } from "next-common/context/chain";
import useMySalaryClaimant from "next-common/hooks/fellowship/salary/useMySalaryClaimant";
import useSalaryFellowshipPeriods from "next-common/hooks/fellowship/salary/useSalaryFellowshipPeriods";
import { useCalcPeriodBlocks } from "next-common/hooks/useCalcPeriodBlocks";
import { ONE_DAY } from "next-common/utils/constants";
import Link from "next/link";
import Prompt from "../prompt";

export default function CollectivesSalaryRegisterWarning({ section, status }) {
  const { cycleStart } = status || {};

  const { blockTime } = useChainSettings();

  const { registrationPeriod } = useSalaryFellowshipPeriods();
  const { remainBlocks } = useCalcPeriodBlocks(registrationPeriod, cycleStart);

  const remainMS = blockTime * remainBlocks;
  const isInWarningTime = remainMS > ONE_DAY && remainMS <= ONE_DAY * 3;

  if (!isInWarningTime) {
    return null;
  }

  return (
    <CollectivesSalaryRegisterWarningImpl section={section} stats={status} />
  );
}

function CollectivesSalaryRegisterWarningImpl({ section, stats }) {
  const { claimant } = useMySalaryClaimant();

  const isRegisteredOrAttempted =
    has(claimant?.status, "registered") || has(claimant?.status, "attempted");

  if (isRegisteredOrAttempted) {
    return null;
  }

  return (
    <Prompt expires={1} type={PromptTypes.WARNING}>
      The registration period of current {upperFirst(section)} salary cycle is
      about to expire. Register{" "}
      <Link
        className="underline"
        href={`${section}/salary/cycles/${stats.cycleIndex}`}
      >
        here
      </Link>
    </Prompt>
  );
}
