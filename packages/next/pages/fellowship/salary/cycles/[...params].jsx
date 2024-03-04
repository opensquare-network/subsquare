import { withCommonProps } from "next-common/lib";
import { fetchOpenGovTracksProps } from "next-common/services/serverSide";
import FellowshipSalaryCycleLayout from "next-common/components/fellowship/salary/cycles/layout";
import FellowshipSalaryCycleDetailTabsList from "next-common/components/fellowship/salary/cycles/tabsList";
import { ssrNextApi } from "next-common/services/nextApi";
import {
  fellowshipSalaryCycleFeedsApi,
  fellowshipSalaryCycleRegistrationsApi,
} from "next-common/services/url";

export default function FellowshipSalaryCyclePage() {
  return (
    <FellowshipSalaryCycleLayout>
      <FellowshipSalaryCycleDetailTabsList />
    </FellowshipSalaryCycleLayout>
  );
}

export const getServerSideProps = withCommonProps(async (context) => {
  const {
    params: [id],
    page,
  } = context.query;

  const [tracksProps, { result: registrations }, { result: feeds }] =
    await Promise.all([
      fetchOpenGovTracksProps(),
      ssrNextApi.fetch(fellowshipSalaryCycleRegistrationsApi(id)),
      ssrNextApi.fetch(fellowshipSalaryCycleFeedsApi(id), { page }),
    ]);

  return {
    props: {
      ...tracksProps,
      id,
      registrations: registrations ?? {},
      feeds: feeds ?? {},
    },
  };
});
