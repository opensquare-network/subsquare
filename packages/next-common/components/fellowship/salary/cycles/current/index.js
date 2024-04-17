import { TitleContainer } from "next-common/components/styled/containers/titleContainer";
import FellowshipSalaryStats from "next-common/components/overview/fellowship/salary/stats";
import { SecondaryCard } from "next-common/components/styled/containers/secondaryCard";
import FellowshipSalaryStatsDetailLink from "next-common/components/overview/fellowship/salary/detailLink";
import DisabledTipButton from "next-common/components/extendButton/disabledTipButton";
import { SystemPlus } from "@osn/icons/subsquare";
import { useChain } from "next-common/context/chain";
import Chains from "next-common/utils/consts/chains";
export default function FellowshipSalaryActiveCycle() {
  const chain = useChain();
  return (
    <>
      <TitleContainer className="mb-4">Current Cycle</TitleContainer>

      <SecondaryCard>
        <FellowshipSalaryStats />
        <div className="mt-2 flex items-center justify-end gap-4">
          <FellowshipSalaryStatsDetailLink />
          {chain === Chains.collectives ? (
            <DisabledTipButton
              typeStyle="secondary"
              tipMsg="Only members can induct"
              size="small"
              iconLeft={<SystemPlus className="w-4 h-4" />}
              disabled={false}
            >
              Import & Register
            </DisabledTipButton>
          ) : null}
        </div>
      </SecondaryCard>
    </>
  );
}
