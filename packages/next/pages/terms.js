import { withCommonProps } from "next-common/lib";
import Terms from "next-common/components/pages/terms";
import { fetchOpenGovTracksProps } from "next-common/services/serverSide";

export default Terms;

export const getServerSideProps = withCommonProps(async () => {
  const tracksProps = await fetchOpenGovTracksProps();

  return {
    props: {
      ...tracksProps,
    },
  };
});
