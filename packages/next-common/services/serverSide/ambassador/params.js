import { withCommonProps } from "next-common/lib";
import { fetchOpenGovTracksProps } from "next-common/services/serverSide";
import { backendApi } from "next-common/services/nextApi";
import { ambassadorParamsApi } from "next-common/services/url";

const getAmbassadorParamsServerSideProps = withCommonProps(async () => {
  const [tracksProps, { result: ambassadorParams = {} }] = await Promise.all([
    fetchOpenGovTracksProps(),
    backendApi.fetch(ambassadorParamsApi),
  ]);

  return {
    props: {
      ...tracksProps,
      ambassadorParams,
    },
  };
});

export default getAmbassadorParamsServerSideProps;
