import MembersList from "components/fellowship/memberList";
import ListLayout from "next-common/components/layout/ListLayout";
import { fetchOpenGovTracksProps } from "next-common/services/serverSide";
import { withCommonProps } from "next-common/lib";
import { ssrNextApi } from "next-common/services/nextApi";
import { fellowshipMembersApiUri } from "next-common/services/url";
import { usePageProps } from "next-common/context/page";

export default function MembersPage() {
  const { fellowshipMembers } = usePageProps();
  const category = "Fellowship Members";
  const seoInfo = { title: category, desc: category };

  return (
    <ListLayout seoInfo={seoInfo} title={category}>
      <MembersList items={fellowshipMembers} loading={false} />
    </ListLayout>
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
