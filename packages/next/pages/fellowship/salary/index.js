import nextApi from "next-common/services/nextApi";
import FellowshipSalaryCommon from "next-common/components/fellowship/salary/common";
import FellowshipHistoryCyclesSection from "next-common/components/fellowship/salary/cycles/section";
import FellowshipSalaryActiveCycle from "next-common/components/fellowship/salary/cycles/current";
import { withFellowshipSalaryCommonProps } from "next-common/services/serverSide/fellowship/common";

export default function FellowshipSalaryPage() {
  return (
    <FellowshipSalaryCommon>
      <FellowshipSalaryActiveCycle />
      <FellowshipHistoryCyclesSection />
    </FellowshipSalaryCommon>
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
