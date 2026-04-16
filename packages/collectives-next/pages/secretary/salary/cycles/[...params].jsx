import SecretarySalaryCycleLayout from "next-common/components/secretary/salary/cycles/layout";
import SecretarySalaryCycleDetailTabsList from "next-common/components/secretary/salary/cycles/tabsList";
import SecretarySalaryCycleDetailInfo from "next-common/components/secretary/salary/cycles/info";
import FellowshipSalaryCycleDetailNotFound from "next-common/components/fellowship/salary/cycles/notFound";
import { backendApi } from "next-common/services/nextApi";
import {
  secretarySalaryCycleApi,
  secretarySalaryCycleFeedsApi,
  secretarySalaryCycleRegisteredPaymentsApi,
  secretarySalaryCycleRegistrationsApi,
  secretarySalaryCycleUnregisteredPaymentsApi,
} from "next-common/services/url";
import { withSecretarySalaryCommonProps } from "next-common/services/serverSide/secretary/common";
import { SecretaryMySalaryClaimantProvider } from "next-common/context/secretary/myClaimant";
import CollectivesProvider from "next-common/context/collectives/collectives";
import { defaultPageSize } from "next-common/utils/constants";

export default function SecretarySalaryCyclePage({ cycle }) {
  return (
    <CollectivesProvider section="secretary">
      <SecretaryMySalaryClaimantProvider>
        <SecretarySalaryCycleLayout>
          {cycle ? (
            <div className="space-y-6">
              <SecretarySalaryCycleDetailInfo />
              <SecretarySalaryCycleDetailTabsList />
            </div>
          ) : (
            <FellowshipSalaryCycleDetailNotFound />
          )}
        </SecretarySalaryCycleLayout>
      </SecretaryMySalaryClaimantProvider>
    </CollectivesProvider>
  );
}

export const getServerSideProps = withSecretarySalaryCommonProps(
  async (context) => {
    const {
      params: [id],
      page,
    } = context.query;

    const { result: cycle } = await backendApi.fetch(
      secretarySalaryCycleApi(id),
    );

    let registrations;
    let registeredPayments;
    let unRegisteredPayments;
    let feeds;

    if (cycle) {
      const [
        { result: registrationsResult },
        { result: registeredPaymentsResult },
        { result: unRegisteredPaymentsResult },
        { result: feedsResult },
      ] = await Promise.all([
        backendApi.fetch(secretarySalaryCycleRegistrationsApi(id), {
          page,
          pageSize: defaultPageSize,
        }),
        backendApi.fetch(secretarySalaryCycleRegisteredPaymentsApi(id), {
          page,
          pageSize: defaultPageSize,
        }),
        backendApi.fetch(secretarySalaryCycleUnregisteredPaymentsApi(id), {
          page,
          pageSize: defaultPageSize,
        }),
        backendApi.fetch(secretarySalaryCycleFeedsApi(id), {
          page,
          pageSize: defaultPageSize,
        }),
      ]);

      registrations = registrationsResult;
      registeredPayments = registeredPaymentsResult;
      unRegisteredPayments = unRegisteredPaymentsResult;
      feeds = feedsResult;
    }

    return {
      props: {
        id,
        cycle: cycle || null,
        registrations: registrations || {},
        registeredPayments: registeredPayments || {},
        unRegisteredPayments: unRegisteredPayments || {},
        feeds: feeds || {},
      },
    };
  },
);
