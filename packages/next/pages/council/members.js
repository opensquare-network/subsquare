import ListLayout from "next-common/components/layout/ListLayout";
import MembersNoElections from "components/council/membersNoElections";
import isMoonChain from "next-common/utils/isMoonChain";
import { detailPageCategory } from "next-common/utils/consts/business/category";
import { getServerSidePropsWithTracks } from "next-common/services/serverSide";

export default function MembersPage() {
  const category = "Council Members";
  const seoInfo = { title: category, desc: category };

  let members = <MembersNoElections />;
  if (isMoonChain()) {
    members = <MembersNoElections type={detailPageCategory.COUNCIL_MOTION} />;
  }

  return (
    <ListLayout
      seoInfo={seoInfo}
      title={category}
      description="Council members"
    >
      {members}
    </ListLayout>
  );
}

export const getServerSideProps = getServerSidePropsWithTracks;
