import FellowshipSalaryCycleLayout from "next-common/components/fellowship/salary/cycles/layout";
import FellowshipSalaryCycleDetailTabsList from "next-common/components/fellowship/salary/cycles/tabsList";
import FellowshipSalaryCycleDetailInfo from "next-common/components/fellowship/salary/cycles/info";
import FellowshipSalaryCycleDetailNotFound from "next-common/components/fellowship/salary/cycles/notFound";
import nextApi from "next-common/services/nextApi";
import {
  fellowshipSalaryCycleApi,
  fellowshipSalaryCycleFeedsApi,
  fellowshipSalaryCycleRegistrationsApi,
  fellowshipSalaryCycleRegisteredPaymentsApi,
  fellowshipSalaryCycleUnregisteredPaymentsApi,
} from "next-common/services/url";
import { withFellowshipSalaryCommonProps } from "next-common/services/serverSide/fellowship/common";
import useFetchFellowshipMembers from "next-common/hooks/fellowship/collective/useFetchFellowshipMembers";
import useSubFellowshipSalaryStats from "next-common/hooks/fellowship/salary/useSubFellowshipSalaryStats";
import useFetchFellowshipSalaryClaimants from "next-common/hooks/fellowship/salary/useFetchFellowshipSalaryClaimants";
import { MySalaryClaimantProvider } from "next-common/context/fellowship/myClaimant";
import CollectivesProvider from "next-common/context/collectives/collectives";

export default function FellowshipSalaryCyclePage({ cycle, fellowshipParams }) {
  useFetchFellowshipSalaryClaimants();
  useFetchFellowshipMembers();
  useSubFellowshipSalaryStats();

  return (
    <CollectivesProvider params={fellowshipParams}>
      <MySalaryClaimantProvider>
        <FellowshipSalaryCycleLayout>
          {cycle ? (
            <div className="space-y-6">
              <FellowshipSalaryCycleDetailInfo />
              <FellowshipSalaryCycleDetailTabsList />
            </div>
          ) : (
            <FellowshipSalaryCycleDetailNotFound />
          )}
        </FellowshipSalaryCycleLayout>
      </MySalaryClaimantProvider>
    </CollectivesProvider>
  );
}

export const getServerSideProps = withFellowshipSalaryCommonProps(
  async (context) => {
    const {
      params: [id],
      page,
    } = context.query;

    const { result: cycle } = await nextApi.fetch(fellowshipSalaryCycleApi(id));

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
        nextApi.fetch(fellowshipSalaryCycleRegistrationsApi(id), { page }),
        nextApi.fetch(fellowshipSalaryCycleRegisteredPaymentsApi(id), {
          page,
        }),
        nextApi.fetch(fellowshipSalaryCycleUnregisteredPaymentsApi(id), {
          page,
        }),
        nextApi.fetch(fellowshipSalaryCycleFeedsApi(id), {
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
