import { backendApi } from "next-common/services/nextApi";
import FellowshipSalaryCommon from "next-common/components/fellowship/salary/common";
import SecretarySalaryActiveCycle from "next-common/components/secretary/salary/cycles/current";
import { withSecretarySalaryCommonProps } from "next-common/services/serverSide/secretary/common";
import { secretarySalaryHistoryCyclesApi } from "next-common/services/url";
import FellowshipHistoryCyclesSection from "next-common/components/fellowship/salary/cycles/section";

export default function SecretarySalaryPage() {
  return (
    <FellowshipSalaryCommon section="secretary">
      <SecretarySalaryActiveCycle />
      <FellowshipHistoryCyclesSection />
    </FellowshipSalaryCommon>
  );
}

export const getServerSideProps = withSecretarySalaryCommonProps(
  async (context) => {
    const { page = 1, page_size: pageSize = 10 } = context.query;

    const { result: historyCycles = {} } = await backendApi.fetch(
      secretarySalaryHistoryCyclesApi,
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
