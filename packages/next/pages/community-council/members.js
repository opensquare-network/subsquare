import ListLayout from "next-common/components/layout/ListLayout";
import MembersList from "next-common/components/membersList/simpleMembersList";
import CollectiveProvider, {
  collectivePallets,
} from "next-common/context/collective";
import { getServerSidePropsWithTracks } from "next-common/services/serverSide";
import useCouncilMembers from "next-common/utils/hooks/useCouncilMembers";
import usePrime from "next-common/utils/hooks/usePrime";

export default function CommunityCouncilMembersPage() {
  return (
    <CollectiveProvider pallet={collectivePallets.communityCouncil}>
      <CommunityCouncilMembersPageImpl />
    </CollectiveProvider>
  );
}

function CommunityCouncilMembersPageImpl() {
  const members = useCouncilMembers();
  const prime = usePrime();

  const category = "Community Council Members";
  const seoInfo = { title: category, desc: category };

  return (
    <ListLayout title={category} seoInfo={seoInfo}>
      <MembersList prime={prime} items={members || []} loading={!members} />
    </ListLayout>
  );
}

export const getServerSideProps = getServerSidePropsWithTracks;
