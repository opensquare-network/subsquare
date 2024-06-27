import { withCommonProps } from "next-common/lib";
import { fetchOpenGovTracksProps } from "next-common/services/serverSide";
import nextApi from "next-common/services/nextApi";
import { ambassadorParamsApi } from "next-common/services/url";

const getAmbassadorParamsServerSideProps = withCommonProps(async () => {
  const [tracksProps, { result: ambassadorParams = {} }] = await Promise.all([
    fetchOpenGovTracksProps(),
    nextApi.fetch(ambassadorParamsApi),
  ]);

  return {
    props: {
      ...tracksProps,
      ambassadorParams,
    },
  };
});

export default getAmbassadorParamsServerSideProps;
