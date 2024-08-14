import ListLayout from "next-common/components/layout/ListLayout";
import MembersNoElections from "components/council/membersNoElections";
import { getServerSidePropsWithTracks } from "next-common/services/serverSide";

export default function MembersPage() {
  const category = "Council Members";
  const seoInfo = { title: category, desc: category };

  return (
    <ListLayout
      seoInfo={seoInfo}
      title={category}
      description="Council members"
    >
      <MembersNoElections />
    </ListLayout>
  );
}

export const getServerSideProps = getServerSidePropsWithTracks;
