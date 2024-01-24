import MembersList from "components/fellowship/memberList";
import ListLayout from "next-common/components/layout/ListLayout";
import { fetchOpenGovTracksProps } from "next-common/services/serverSide";
import { withCommonProps } from "next-common/lib";
import { ssrNextApi } from "next-common/services/nextApi";
import {
  fellowshipMembersApiUri,
  fellowshipParamsApi,
} from "next-common/services/url";
import { usePageProps } from "next-common/context/page";
import useFetchFellowshipCoreMembers from "next-common/hooks/fellowship/core/useFetchFellowshipCoreMembers";

export default function MembersPage() {
  const { fellowshipMembers, fellowshipParams } = usePageProps();
  const category = "Fellowship Members";
  const seoInfo = { title: category, desc: category };
  useFetchFellowshipCoreMembers(fellowshipMembers);
  console.log("fellowshipParams", fellowshipParams);

  return (
    <ListLayout seoInfo={seoInfo} title={category}>
      <MembersList items={fellowshipMembers} loading={false} />
    </ListLayout>
  );
}

export const getServerSideProps = withCommonProps(async () => {
  const [
    tracksProps,
    { result: fellowshipMembers },
    { result: fellowshipParams = {} },
  ] = await Promise.all([
    fetchOpenGovTracksProps(),
    ssrNextApi.fetch(fellowshipMembersApiUri),
    ssrNextApi.fetch(fellowshipParamsApi),
  ]);

  return {
    props: {
      ...tracksProps,
      fellowshipMembers,
      fellowshipParams,
    },
  };
});
