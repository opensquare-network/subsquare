import AmbassadorSalaryCommon from "next-common/components/ambassador/common";
import nextApi from "next-common/services/nextApi";
import { withAmbassadorSalaryCommonProps } from "next-common/services/serverSide/ambassador/common";
import { ambassadorSalaryHistoryCyclesApi } from "next-common/services/url";
import AmbassadorSalaryCurrentCycle from "next-common/components/ambassador/salary/cycles/current";
import AmbassadorHistoryCyclesSection from "next-common/components/ambassador/salary/cycles/historyCyclesSection";

export default function AmbassadorSalaryPage() {
  return (
    <AmbassadorSalaryCommon>
      <AmbassadorSalaryCurrentCycle />
      <AmbassadorHistoryCyclesSection />
    </AmbassadorSalaryCommon>
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
