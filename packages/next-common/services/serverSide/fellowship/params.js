import { withCommonProps } from "next-common/lib";
import { fetchOpenGovTracksProps } from "next-common/services/serverSide";
import { ssrNextApi } from "next-common/services/nextApi";
import { fellowshipParamsApi } from "next-common/services/url";

const getFellowshipParamsServerSideProps = withCommonProps(async () => {
  const [tracksProps, { result: fellowshipParams = {} }] = await Promise.all([
    fetchOpenGovTracksProps(),
    ssrNextApi.fetch(fellowshipParamsApi),
  ]);

  return {
    props: {
      ...tracksProps,
      fellowshipParams,
    },
  };
});

export default getFellowshipParamsServerSideProps;
