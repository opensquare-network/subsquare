import FellowshipSalaryCommon from "next-common/components/fellowship/salary/common";
import FellowshipSalaryFeedsContainer from "next-common/components/fellowship/salary/feeds/container";
import nextApi from "next-common/services/nextApi";
import { withAmbassadorSalaryCommonProps } from "next-common/services/serverSide/ambassador/common";
import { ambassadorSalaryFeedsApi } from "next-common/services/url";
import { defaultPageSize } from "next-common/utils/constants";

export default function AmbassadorSalaryFeedsPage({
  ambassadorSalaryFeeds = {},
}) {
  return (
    <FellowshipSalaryCommon section="ambassador">
      <FellowshipSalaryFeedsContainer feeds={ambassadorSalaryFeeds} />
    </FellowshipSalaryCommon>
  );
}

export const getServerSideProps = withAmbassadorSalaryCommonProps(
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

    const { result: ambassadorSalaryFeeds } = await nextApi.fetch(
      ambassadorSalaryFeedsApi,
      query,
    );

    return {
      props: {
        ambassadorSalaryFeeds: ambassadorSalaryFeeds || {},
      },
    };
  },
);
