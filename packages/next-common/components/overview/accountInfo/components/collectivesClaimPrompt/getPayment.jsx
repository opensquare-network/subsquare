import { extractTime } from "@polkadot/util";
import { has } from "lodash-es";
import { PromptTypes } from "next-common/components/scrollPrompt";
import { useChainSettings } from "next-common/context/chain";
import useMySalaryClaimant from "next-common/hooks/fellowship/salary/useMySalaryClaimant";
import useSalaryFellowshipPeriods from "next-common/hooks/fellowship/salary/useSalaryFellowshipPeriods";
import { useCalcPeriodBlocks } from "next-common/hooks/useCalcPeriodBlocks";
import { ambassadorSalaryStatusSelector } from "next-common/store/reducers/ambassador/salary";
import { fellowshipSalaryStatusSelector } from "next-common/store/reducers/fellowship/salary";
import Link from "next/link";
import { useSelector } from "react-redux";
import Prompt from "../prompt";

export default function CollectivesClaimGetPaymentPrompt({
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

  const isRegistered = has(claimant?.status, "registered");

  const { registrationPeriod, payoutPeriod } = useSalaryFellowshipPeriods();
  const payoutStart = cycleStart + registrationPeriod || null;
  const { remainBlocks } = useCalcPeriodBlocks(payoutPeriod, payoutStart);

  const ms = blockTime * remainBlocks;
  const { days } = extractTime(ms);
  const displayDays = days > 0 && days <= 3;

  if (!stats || !memberData?.coreMember || !isRegistered || !displayDays) {
    return null;
  }

  return (
    <Prompt expires={null} type={PromptTypes.WARNING}>
      The payout period of current salary cycle is about to expire. Get payment{" "}
      <Link
        className="underline"
        href={`${section}/salary/cycles/${stats.cycleIndex}`}
      >
        here
      </Link>
    </Prompt>
  );
}
