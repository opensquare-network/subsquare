import SecretarySalaryCycleLayout from "next-common/components/secretary/salary/cycles/layout";
import { withSecretarySalaryCommonProps } from "next-common/services/serverSide/secretary/common";
import CollectivesProvider from "next-common/context/collectives/collectives";

export default function SecretarySalaryCyclePage() {
  return (
    <CollectivesProvider section="secretary">
      <SecretarySalaryCycleLayout />
    </CollectivesProvider>
  );
}

export const getServerSideProps = withSecretarySalaryCommonProps(
  async (context) => {
    const {
      params: [id],
    } = context.query;

    return {
      props: {
        id,
      },
    };
  },
);
