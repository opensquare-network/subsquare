import FellowshipSalaryCommon from "next-common/components/fellowship/salary/common";
import FellowshipSalaryFeedsContainer from "next-common/components/fellowship/salary/feeds/container";
import { backendApi } from "next-common/services/nextApi";
import { withSecretarySalaryCommonProps } from "next-common/services/serverSide/secretary/common";
import { secretarySalaryFeedsApi } from "next-common/services/url";
import { defaultPageSize } from "next-common/utils/constants";
import { getFeedsEvent } from "next-common/utils/fellowship/getFeedsEvent";

export default function SecretarySalaryFeedsPage({
  secretarySalaryFeeds = {},
}) {
  return (
    <FellowshipSalaryCommon section="secretary">
      <FellowshipSalaryFeedsContainer feeds={secretarySalaryFeeds} />
    </FellowshipSalaryCommon>
  );
}

export const getServerSideProps = withSecretarySalaryCommonProps(
  async (context) => {
    const { page = 0, event = null, who = null } = context.query;
    const query = {
      page,
      page_size: defaultPageSize,
    };
    if (event) {
      Object.assign(query, { event: getFeedsEvent("salary", event) });
    }
    if (who) {
      Object.assign(query, { who });
    }

    const { result: secretarySalaryFeeds } = await backendApi.fetch(
      secretarySalaryFeedsApi,
      query,
    );

    return {
      props: {
        secretarySalaryFeeds: secretarySalaryFeeds || {},
      },
    };
  },
);
