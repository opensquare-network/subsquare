import { withCommonProps } from "next-common/lib";
import { fetchOpenGovTracksProps } from "next-common/services/serverSide";
import nextApi from "next-common/services/nextApi";
import {
  fellowshipMembersApiUri,
  fellowshipParamsApi,
} from "next-common/services/url";

const getFellowshipMembersServerSideProps = withCommonProps(async () => {
  const [
    tracksProps,
    { result: fellowshipMembers },
    { result: fellowshipParams = {} },
  ] = await Promise.all([
    fetchOpenGovTracksProps(),
    nextApi.fetch(fellowshipMembersApiUri),
    nextApi.fetch(fellowshipParamsApi),
  ]);

  return {
    props: {
      ...tracksProps,
      fellowshipMembers: fellowshipMembers ?? null,
      fellowshipParams,
    },
  };
});

export default getFellowshipMembersServerSideProps;
