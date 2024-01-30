import { usePageProps } from "next-common/context/page";
import useFetchFellowshipCoreMembers from "next-common/hooks/fellowship/core/useFetchFellowshipCoreMembers";
import FellowshipCoreCommon from "next-common/components/fellowship/core/common";
import FellowshipCoreFeedsList from "next-common/components/fellowship/core/feeds/list";
import { withCommonProps } from "next-common/lib";
import { fetchOpenGovTracksProps } from "next-common/services/serverSide";
import { ssrNextApi } from "next-common/services/nextApi";
import {
  fellowshipCoreFeedsApiUri,
  fellowshipMembersApiUri,
} from "next-common/services/url";
import { TitleContainer } from "next-common/components/styled/containers/titleContainer";

export default function FellowshipCoreFeedsPage() {
  const { fellowshipMembers, fellowshipCoreFeeds } = usePageProps();
  useFetchFellowshipCoreMembers(fellowshipMembers);
  // todo: 1. add api to fetch core feeds
  // todo: 2. implement feeds components

  return (
    <FellowshipCoreCommon>
      <TitleContainer>
        <span>
          Feeds
          {!!fellowshipCoreFeeds.total && (
            <span className="text-textTertiary text14Medium ml-1">
              {fellowshipCoreFeeds.total}
            </span>
          )}
        </span>
      </TitleContainer>
      <div className="space-y-4 mt-4">
        <FellowshipCoreFeedsList feeds={fellowshipCoreFeeds} />
      </div>
    </FellowshipCoreCommon>
  );
}

export const getServerSideProps = withCommonProps(async () => {
  const [
    tracksProps,
    { result: fellowshipMembers },
    { result: fellowshipCoreFeeds },
  ] = await Promise.all([
    fetchOpenGovTracksProps(),
    ssrNextApi.fetch(fellowshipMembersApiUri),
    ssrNextApi.fetch(fellowshipCoreFeedsApiUri),
  ]);

  return {
    props: {
      ...tracksProps,
      fellowshipMembers,
      fellowshipCoreFeeds,
    },
  };
});
