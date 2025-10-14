import MembersList from "next-common/components/membersList/simpleMembersList";
import usePrime from "next-common/utils/hooks/usePrime";
import ListLayout from "next-common/components/layout/ListLayout";
import { getServerSidePropsWithTracks } from "next-common/services/serverSide";
import CollectiveProvider from "next-common/context/collective";
import useCollectiveMembers from "next-common/utils/hooks/collectives/useCollectiveMembers";
import useTechcommPallet from "next-common/hooks/techcomm/useTechcommPallet";

export default function MembersPage() {
  const pallet = useTechcommPallet();
  return (
    <CollectiveProvider pallet={pallet}>
      <MembersPageImpl />
    </CollectiveProvider>
  );
}

function MembersPageImpl() {
  const { members, loading } = useCollectiveMembers();
  const prime = usePrime();

  const category = "Technical Committee Members";
  const seoInfo = { title: category, desc: category };

  return (
    <ListLayout
      seoInfo={seoInfo}
      title={category}
      description="Technical committee members"
    >
      <MembersList prime={prime} items={members || []} loading={loading} />
    </ListLayout>
  );
}

export const getServerSideProps = getServerSidePropsWithTracks;
