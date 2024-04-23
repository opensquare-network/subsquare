import nextApi from "next-common/services/nextApi";
import FellowshipSalaryCommon from "next-common/components/fellowship/salary/common";
import FellowshipHistoryCyclesSection from "next-common/components/fellowship/salary/cycles/section";
import FellowshipSalaryActiveCycle from "next-common/components/fellowship/salary/cycles/current";
import { withFellowshipSalaryCommonProps } from "next-common/services/serverSide/fellowship/common";
import { MySalaryClaimantProvider } from "next-common/context/fellowship/myClaimant";

export default function FellowshipSalaryPage() {
  return (
    <MySalaryClaimantProvider>
      <FellowshipSalaryCommon>
        <FellowshipSalaryActiveCycle />
        <FellowshipHistoryCyclesSection />
      </FellowshipSalaryCommon>
    </MySalaryClaimantProvider>
  );
}

export const getServerSideProps = withFellowshipSalaryCommonProps(async () => {
  const { result: historyCycles = {} } = await nextApi.fetch(
    "fellowship/salary/history_cycles",
  );

  return {
    props: {
      historyCycles,
    },
  };
});
