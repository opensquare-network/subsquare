import { backendApi } from "next-common/services/nextApi";
import FellowshipSalaryCommon from "next-common/components/fellowship/salary/common";
import SecretarySalaryActiveCycle from "next-common/components/secretary/salary/cycles/current";
import FellowshipSalaryCycles from "next-common/components/fellowship/salary/cycles/list";
import { TitleContainer } from "next-common/components/styled/containers/titleContainer";
import { withSecretarySalaryCommonProps } from "next-common/services/serverSide/secretary/common";
import { secretarySalaryHistoryCyclesApi } from "next-common/services/url";
import { usePageProps } from "next-common/context/page";

function SecretarySalaryHistoryCyclesSection() {
  const { historyCycles } = usePageProps();

  return (
    <>
      <TitleContainer className="my-4">History</TitleContainer>

      <div className="space-y-4 mt-4">
        <FellowshipSalaryCycles historyCycles={historyCycles} />
      </div>
    </>
  );
}

export default function SecretarySalaryPage() {
  return (
    <FellowshipSalaryCommon section="secretary">
      <SecretarySalaryActiveCycle />
      <SecretarySalaryHistoryCyclesSection />
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
