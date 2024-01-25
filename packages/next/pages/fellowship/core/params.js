import { withCommonProps } from "next-common/lib";
import { fetchOpenGovTracksProps } from "next-common/services/serverSide";
import { ssrNextApi } from "next-common/services/nextApi";
import { fellowshipParamsApi } from "next-common/services/url";
import FellowshipCoreCommon from "next-common/components/fellowship/core/common";
import FellowshipCoreParamsContainer from "next-common/components/fellowship/params/container";

export default function FellowshipCoreParamsPage({ fellowshipParams }) {
  return (
    <FellowshipCoreCommon>
      <FellowshipCoreParamsContainer params={fellowshipParams} />
    </FellowshipCoreCommon>
  );
}

export const getServerSideProps = withCommonProps(async () => {
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
