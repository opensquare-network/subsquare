import { usePageProps } from "next-common/context/page";
import useFetchFellowshipCoreMembers from "next-common/hooks/fellowship/core/useFetchFellowshipCoreMembers";
import FellowshipCoreCommon from "next-common/components/fellowship/core/common";
import { withCommonProps } from "next-common/lib";
import { fetchOpenGovTracksProps } from "next-common/services/serverSide";
import { ssrNextApi } from "next-common/services/nextApi";
import {
  fellowshipCoreFeedsApiUri,
  fellowshipMembersApiUri,
} from "next-common/services/url";
import FellowshipCoreFeedsContainer from "next-common/components/fellowship/core/feeds/container";
import { defaultPageSize } from "next-common/utils/constants";

export default function FellowshipCoreFeedsPage() {
  const { fellowshipMembers, fellowshipCoreFeeds } = usePageProps();
  useFetchFellowshipCoreMembers(fellowshipMembers);

  return (
    <FellowshipCoreCommon>
      <FellowshipCoreFeedsContainer feeds={fellowshipCoreFeeds} />
    </FellowshipCoreCommon>
  );
}

export const getServerSideProps = withCommonProps(async (context) => {
  const { page = 0 } = context.query;

  const [
    tracksProps,
    { result: fellowshipMembers },
    { result: fellowshipCoreFeeds },
  ] = await Promise.all([
    fetchOpenGovTracksProps(),
    ssrNextApi.fetch(fellowshipMembersApiUri),
    ssrNextApi.fetch(fellowshipCoreFeedsApiUri, {
      page,
      page_size: defaultPageSize,
    }),
  ]);

  return {
    props: {
      ...tracksProps,
      fellowshipMembers,
      fellowshipCoreFeeds,
    },
  };
});
