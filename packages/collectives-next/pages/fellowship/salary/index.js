import { backendApi } from "next-common/services/nextApi";
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

export const getServerSideProps = withFellowshipSalaryCommonProps(
  async (context) => {
    const { page = 1, page_size: pageSize = 10 } = context.query;

    const { result: historyCycles = {} } = await backendApi.fetch(
      "fellowship/salary/history_cycles",
      {
        page,
        pageSize,
      },
    );

    return {
      props: {
        historyCycles,
      },
    };
  },
);
