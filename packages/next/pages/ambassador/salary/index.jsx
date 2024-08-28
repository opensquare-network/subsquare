import nextApi from "next-common/services/nextApi";
import { withAmbassadorSalaryCommonProps } from "next-common/services/serverSide/ambassador/common";
import { ambassadorSalaryHistoryCyclesApi } from "next-common/services/url";
import FellowshipSalaryActiveCycle from "next-common/components/fellowship/salary/cycles/current";
import FellowshipHistoryCyclesSection from "next-common/components/fellowship/salary/cycles/section";
import FellowshipSalaryCommon from "next-common/components/fellowship/salary/common";

export default function AmbassadorSalaryPage() {
  return (
    <FellowshipSalaryCommon section="ambassador">
      <FellowshipSalaryActiveCycle />
      <FellowshipHistoryCyclesSection />
    </FellowshipSalaryCommon>
  );
}

export const getServerSideProps = withAmbassadorSalaryCommonProps(async () => {
  const { result: historyCycles = {} } = await nextApi.fetch(
    ambassadorSalaryHistoryCyclesApi,
  );

  return {
    props: {
      historyCycles,
    },
  };
});
