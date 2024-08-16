import { has, upperFirst } from "lodash-es";
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
import { ONE_DAY } from "next-common/utils/constants";

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

  const isRegisteredOrAttempted =
    has(claimant?.status, "registered") || has(claimant?.status, "attempted");

  const { registrationPeriod } = useSalaryFellowshipPeriods();
  const { remainBlocks } = useCalcPeriodBlocks(registrationPeriod, cycleStart);
  const ms = blockTime * remainBlocks;
  const isInWarningTime = ms > ONE_DAY && ms <= ONE_DAY * 3;

  if (
    !stats ||
    !memberData?.coreMember ||
    isRegisteredOrAttempted ||
    !isInWarningTime
  ) {
    return null;
  }

  return (
    <Prompt expires={null} type={PromptTypes.WARNING}>
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
