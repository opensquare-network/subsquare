import { withCommonProps } from "next-common/lib";
import { fetchOpenGovTracksProps } from "next-common/services/serverSide";
import nextApi from "next-common/services/nextApi";
import {
  ambassadorMembersApiUri,
  ambassadorParamsApi,
  ambassadorTracksApi,
} from "next-common/services/url";

const getAmbassadorMembersServerSideProps = withCommonProps(async () => {
  const [
    tracksProps,
    { result: ambassadorTracks },
    { result: ambassadorMembers },
    { result: ambassadorParams = {} },
  ] = await Promise.all([
    fetchOpenGovTracksProps(),
    nextApi.fetch(ambassadorTracksApi),
    nextApi.fetch(ambassadorMembersApiUri),
    nextApi.fetch(ambassadorParamsApi),
  ]);

  return {
    props: {
      ...tracksProps,
      ambassadorTracks,
      ambassadorMembers,
      ambassadorParams,
    },
  };
});

export default getAmbassadorMembersServerSideProps;
