import { withCommonProps } from "next-common/lib";
import Privacy from "next-common/components/pages/privacy";
import { fetchOpenGovTracksProps } from "next-common/services/serverSide";

export default Privacy;

export const getServerSideProps = withCommonProps(async () => {
  const tracksProps = await fetchOpenGovTracksProps();

  return {
    props: {
      ...tracksProps,
    },
  };
});
