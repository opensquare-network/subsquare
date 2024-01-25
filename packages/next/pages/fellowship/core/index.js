import { withCommonProps } from "next-common/lib";
import { fetchOpenGovTracksProps } from "next-common/services/serverSide";
import FellowshipCoreCommon from "next-common/components/fellowship/core/common";

export default function FellowshipCorePage() {
  return (
    <FellowshipCoreCommon>
      {/* todo: implement fellowship core members page */}
    </FellowshipCoreCommon>
  );
}

export const getServerSideProps = withCommonProps(async () => {
  const tracksProps = await fetchOpenGovTracksProps();

  return {
    props: {
      ...tracksProps,
    },
  };
});
