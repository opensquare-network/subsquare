import FellowshipSalaryCycleLayout from "next-common/components/fellowship/salary/cycles/layout";
import FellowshipSalaryCycleDetailNotFound from "next-common/components/fellowship/salary/cycles/notFound";
import FellowshipSalaryCycleDetailTabsList from "next-common/components/fellowship/salary/cycles/tabsList";
import nextApi from "next-common/services/nextApi";
import { withAmbassadorSalaryCommonProps } from "next-common/services/serverSide/ambassador/common";
import {
  ambassadorSalaryCycleApi,
  ambassadorSalaryCycleFeedsApi,
  ambassadorSalaryCycleRegisteredPaymentsApi,
  ambassadorSalaryCycleRegistrationsApi,
  ambassadorSalaryCycleUnregisteredPaymentsApi,
} from "next-common/services/url";
import AmbassadorSalaryCycleDetailInfo from "next-common/components/ambassador/salary/cycles/info";
import { MyAmbassadorSalaryClaimantProvider } from "next-common/context/ambassador/myClaimant";
import CollectivesProvider from "next-common/context/collectives/collectives";

export default function AmbassadorSalaryCyclePage({ cycle, ambassadorParams }) {
  return (
    <CollectivesProvider params={ambassadorParams} section="ambassador">
      <AmbassadorSalaryCyclePageImpl cycle={cycle} />
    </CollectivesProvider>
  );
}

function AmbassadorSalaryCyclePageImpl({ cycle }) {
  return (
    <MyAmbassadorSalaryClaimantProvider>
      <FellowshipSalaryCycleLayout>
        {cycle ? (
          <div className="space-y-6">
            <AmbassadorSalaryCycleDetailInfo />
            <FellowshipSalaryCycleDetailTabsList />
          </div>
        ) : (
          <FellowshipSalaryCycleDetailNotFound />
        )}
      </FellowshipSalaryCycleLayout>
    </MyAmbassadorSalaryClaimantProvider>
  );
}

export const getServerSideProps = withAmbassadorSalaryCommonProps(
  async (context) => {
    const {
      params: [id],
      page,
    } = context.query;

    const { result: cycle } = await nextApi.fetch(ambassadorSalaryCycleApi(id));

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
        nextApi.fetch(ambassadorSalaryCycleRegistrationsApi(id), { page }),
        nextApi.fetch(ambassadorSalaryCycleRegisteredPaymentsApi(id), {
          page,
        }),
        nextApi.fetch(ambassadorSalaryCycleUnregisteredPaymentsApi(id), {
          page,
        }),
        nextApi.fetch(ambassadorSalaryCycleFeedsApi(id), {
          page,
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
