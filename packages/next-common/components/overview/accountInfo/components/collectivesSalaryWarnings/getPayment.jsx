import { has, upperFirst } from "lodash-es";
import { PromptTypes } from "next-common/components/scrollPrompt";
import { useChainSettings } from "next-common/context/chain";
import useMySalaryClaimant from "next-common/hooks/fellowship/salary/useMySalaryClaimant";
import useSalaryFellowshipPeriods from "next-common/hooks/fellowship/salary/useSalaryFellowshipPeriods";
import { useCalcPeriodBlocks } from "next-common/hooks/useCalcPeriodBlocks";
import { ONE_DAY } from "next-common/utils/constants";
import Link from "next/link";
import Prompt from "../prompt";

export default function CollectivesSalaryGetPaymentWarning({
  section,
  status,
}) {
  const { cycleStart } = status || {};

  const { blockTime } = useChainSettings();

  const { registrationPeriod, payoutPeriod } = useSalaryFellowshipPeriods();
  const payoutStart = cycleStart + registrationPeriod || null;
  const { remainBlocks } = useCalcPeriodBlocks(payoutPeriod, payoutStart);

  const remainMS = blockTime * remainBlocks;
  const isInWarningTime = remainMS > ONE_DAY && remainMS <= ONE_DAY * 3;

  if (!isInWarningTime) {
    return null;
  }

  return (
    <CollectivesSalaryGetPaymentWarningImpl section={section} stats={status} />
  );
}

function CollectivesSalaryGetPaymentWarningImpl({ section, stats }) {
  const { claimant } = useMySalaryClaimant();

  const isRegistered = has(claimant?.status, "registered");

  if (!isRegistered) {
    return null;
  }

  return (
    <Prompt expires={null} type={PromptTypes.WARNING}>
      The payout period of current {upperFirst(section)} salary cycle is about
      to expire. Get payment{" "}
      <Link
        className="underline"
        href={`${section}/salary/cycles/${stats.cycleIndex}`}
      >
        here
      </Link>
    </Prompt>
  );
}
