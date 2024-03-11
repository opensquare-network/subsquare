import { withCommonProps } from "next-common/lib";
import { fetchOpenGovTracksProps } from "next-common/services/serverSide";
import FellowshipSalaryCycleLayout from "next-common/components/fellowship/salary/cycles/layout";
import FellowshipSalaryCycleDetailTabsList from "next-common/components/fellowship/salary/cycles/tabsList";
import FellowshipSalaryCycleDetailInfo from "next-common/components/fellowship/salary/cycles/info";
import FellowshipSalaryCycleDetailNotFound from "next-common/components/fellowship/salary/cycles/notFound";
import { ssrNextApi } from "next-common/services/nextApi";
import {
  fellowshipSalaryCycleApi,
  fellowshipSalaryCycleFeedsApi,
  fellowshipSalaryCycleRegistrationsApi,
  fellowshipSalaryCycleRegisteredPaymentsApi,
  fellowshipSalaryCycleUnregisteredPaymentsApi,
} from "next-common/services/url";

export default function FellowshipSalaryCyclePage({ cycle }) {
  return (
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
  );
}

export const getServerSideProps = withCommonProps(async (context) => {
  const {
    params: [id],
    page,
  } = context.query;

  const [tracksProps, { result: cycle }] = await Promise.all([
    fetchOpenGovTracksProps(),
    ssrNextApi.fetch(fellowshipSalaryCycleApi(id)),
  ]);

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
      ssrNextApi.fetch(fellowshipSalaryCycleRegistrationsApi(id), { page }),
      ssrNextApi.fetch(fellowshipSalaryCycleRegisteredPaymentsApi(id), {
        page,
      }),
      ssrNextApi.fetch(fellowshipSalaryCycleUnregisteredPaymentsApi(id), {
        page,
      }),
      ssrNextApi.fetch(fellowshipSalaryCycleFeedsApi(id), {
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
      ...tracksProps,
      id,
      cycle: cycle || null,
      registrations: registrations || {},
      registeredPayments: registeredPayments || {},
      unRegisteredPayments: unRegisteredPayments || {},
      feeds: feeds || {},
    },
  };
});
