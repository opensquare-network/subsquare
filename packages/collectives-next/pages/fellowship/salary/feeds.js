import { backendApi } from "next-common/services/nextApi";
import { defaultPageSize } from "next-common/utils/constants";
import FellowshipSalaryCommon from "next-common/components/fellowship/salary/common";
import FellowshipSalaryFeedsContainer from "next-common/components/fellowship/salary/feeds/container";
import { withFellowshipSalaryCommonProps } from "next-common/services/serverSide/fellowship/common";
import { fellowshipSalaryFeedsApi } from "next-common/services/url";

export default function FellowshipSalaryFeedsPage({ fellowshipSalaryFeeds }) {
  return (
    <FellowshipSalaryCommon>
      <FellowshipSalaryFeedsContainer feeds={fellowshipSalaryFeeds} />
    </FellowshipSalaryCommon>
  );
}

export const getServerSideProps = withFellowshipSalaryCommonProps(
  async (context) => {
    const { page = 0, event = null, who = null } = context.query;
    const query = {
      page,
      page_size: defaultPageSize,
    };
    if (event) {
      Object.assign(query, { event });
    }
    if (who) {
      Object.assign(query, { who });
    }

    const { result: fellowshipSalaryFeeds } = await backendApi.fetch(
      fellowshipSalaryFeedsApi,
      query,
    );

    return {
      props: {
        fellowshipSalaryFeeds: fellowshipSalaryFeeds || {},
      },
    };
  },
);
