import { withCommonProps } from "next-common/lib";
import { fetchOpenGovTracksProps } from "next-common/services/serverSide";
import { ssrNextApi } from "next-common/services/nextApi";
import { defaultPageSize } from "next-common/utils/constants";
import FellowshipSalaryCommon from "next-common/components/fellowship/salary/common";
import FellowshipSalaryFeedsContainer from "next-common/components/fellowship/salary/feeds/container";

export default function FellowshipSalaryFeedsPage({ fellowshipSalaryFeeds }) {
  return (
    <FellowshipSalaryCommon>
      <FellowshipSalaryFeedsContainer feeds={fellowshipSalaryFeeds} />
    </FellowshipSalaryCommon>
  );
}

export const getServerSideProps = withCommonProps(async (context) => {
  const { page = 0 } = context.query;

  const [tracksProps, { result: fellowshipSalaryFeeds }] = await Promise.all([
    fetchOpenGovTracksProps(),
    ssrNextApi.fetch("fellowship/salary/feeds", {
      page,
      page_size: defaultPageSize,
    }),
  ]);

  return {
    props: {
      ...tracksProps,
      fellowshipSalaryFeeds,
    },
  };
});
