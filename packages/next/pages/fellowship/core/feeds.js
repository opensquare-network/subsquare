import { usePageProps } from "next-common/context/page";
import useFetchFellowshipCoreMembers from "next-common/hooks/fellowship/core/useFetchFellowshipCoreMembers";
import FellowshipCoreCommon from "next-common/components/fellowship/core/common";
import { withCommonProps } from "next-common/lib";
import { fetchOpenGovTracksProps } from "next-common/services/serverSide";
import { ssrNextApi } from "next-common/services/nextApi";
import { fellowshipMembersApiUri } from "next-common/services/url";
import { TitleContainer } from "next-common/components/styled/containers/titleContainer";

export default function FellowshipCoreFeedsPage() {
  const { fellowshipMembers } = usePageProps();
  useFetchFellowshipCoreMembers(fellowshipMembers);
  // todo: 1. add api to fetch core feeds
  // todo: 2. implement feeds components

  return (
    <FellowshipCoreCommon>
      <TitleContainer>
        <span>Feeds</span>
      </TitleContainer>
      <div className="space-y-4 mt-4">feeds here</div>
    </FellowshipCoreCommon>
  );
}

export const getServerSideProps = withCommonProps(async () => {
  const [tracksProps, { result: fellowshipMembers }] = await Promise.all([
    fetchOpenGovTracksProps(),
    ssrNextApi.fetch(fellowshipMembersApiUri),
  ]);

  return {
    props: {
      ...tracksProps,
      fellowshipMembers,
    },
  };
});
