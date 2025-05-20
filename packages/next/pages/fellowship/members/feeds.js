import FellowshipCoreCommon from "next-common/components/fellowship/core/common";
import { withCommonProps } from "next-common/lib";
import { fetchOpenGovTracksProps } from "next-common/services/serverSide";
import nextApi from "next-common/services/nextApi";
import { fellowshipCoreFeedsApiUri } from "next-common/services/url";
import FellowshipCoreFeedsContainer from "next-common/components/fellowship/core/feeds/container";
import { defaultPageSize } from "next-common/utils/constants";
import CollectivesProvider from "next-common/context/collectives/collectives";

export default function FellowshipCoreFeedsPage({ fellowshipCoreFeeds }) {
  return (
    <CollectivesProvider section="fellowship">
      <FellowshipCoreCommon>
        <FellowshipCoreFeedsContainer feeds={fellowshipCoreFeeds} />
      </FellowshipCoreCommon>
    </CollectivesProvider>
  );
}

export const getServerSideProps = withCommonProps(async (context) => {
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
  const [tracksProps, { result: fellowshipCoreFeeds }] = await Promise.all([
    fetchOpenGovTracksProps(),
    nextApi.fetch(fellowshipCoreFeedsApiUri, query),
  ]);

  return {
    props: {
      ...tracksProps,
      fellowshipCoreFeeds,
    },
  };
});
