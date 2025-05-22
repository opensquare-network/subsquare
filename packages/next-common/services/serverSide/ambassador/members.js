import { withCommonProps } from "next-common/lib";
import { fetchOpenGovTracksProps } from "next-common/services/serverSide";
import { backendApi } from "next-common/services/nextApi";
import {
  ambassadorMembersApiUri,
  ambassadorParamsApi,
} from "next-common/services/url";

const getAmbassadorMembersServerSideProps = withCommonProps(async () => {
  const [
    tracksProps,
    { result: ambassadorMembers },
    { result: ambassadorParams = {} },
  ] = await Promise.all([
    fetchOpenGovTracksProps(),
    backendApi.fetch(ambassadorMembersApiUri),
    backendApi.fetch(ambassadorParamsApi),
  ]);

  return {
    props: {
      ...tracksProps,
      ambassadorMembers,
      ambassadorParams,
    },
  };
});

export default getAmbassadorMembersServerSideProps;
