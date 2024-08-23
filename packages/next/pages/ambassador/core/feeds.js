import { withCommonProps } from "next-common/lib";
import { defaultPageSize } from "next-common/utils/constants";
import { fetchOpenGovTracksProps } from "next-common/services/serverSide";
import nextApi from "next-common/services/nextApi";
import { ambassadorCoreFeedsApiUri } from "next-common/services/url";
import FellowshipCoreCommon from "next-common/components/fellowship/core/common";
import FellowshipCoreFeedsContainer from "next-common/components/fellowship/core/feeds/container";
import CollectivesProvider from "next-common/context/collectives/collectives";

export default function AmbassadorCoreFeedsPage({ ambassadorCoreFeeds }) {
  return (
    <CollectivesProvider section="ambassador">
      <FellowshipCoreCommon>
        {/* todo: we may change the name of `FellowshipCoreFeedsContainer` to a common container */}
        <FellowshipCoreFeedsContainer feeds={ambassadorCoreFeeds} />
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
  const [tracksProps, { result: ambassadorCoreFeeds }] = await Promise.all([
    fetchOpenGovTracksProps(),
    nextApi.fetch(ambassadorCoreFeedsApiUri, query),
  ]);

  return {
    props: {
      ...tracksProps,
      ambassadorCoreFeeds,
    },
  };
});
