import { withCommonProps } from "next-common/lib";
import { fetchOpenGovTracksProps } from "next-common/services/serverSide";
import nextApi from "next-common/services/nextApi";
import { fellowshipParamsApi } from "next-common/services/url";

const getFellowshipParamsServerSideProps = withCommonProps(async () => {
  const [tracksProps, { result: fellowshipParams = {} }] = await Promise.all([
    fetchOpenGovTracksProps(),
    nextApi.fetch(fellowshipParamsApi),
  ]);

  return {
    props: {
      ...tracksProps,
      fellowshipParams,
    },
  };
});

export default getFellowshipParamsServerSideProps;
