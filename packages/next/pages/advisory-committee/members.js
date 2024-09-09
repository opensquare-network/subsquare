import ListLayout from "next-common/components/layout/ListLayout";
import MembersList from "next-common/components/membersList/simpleMembersList";
import CollectiveProvider from "next-common/context/collective";
import { getServerSidePropsWithTracks } from "next-common/services/serverSide";
import useCouncilMembers from "next-common/utils/hooks/useCouncilMembers";
import usePrime from "next-common/utils/hooks/usePrime";

export default function AdvisoryCommitteeMembersPage() {
  return (
    <CollectiveProvider pallet="advisoryCommittee">
      <AdvisoryCommitteeMembersPageImpl />
    </CollectiveProvider>
  );
}

function AdvisoryCommitteeMembersPageImpl() {
  const category = "Advisory Council Members";
  const seoInfo = { title: category, desc: category };

  const members = useCouncilMembers();
  const prime = usePrime();

  return (
    <ListLayout title={category} seoInfo={seoInfo}>
      <MembersList prime={prime} items={members || []} loading={!members} />
    </ListLayout>
  );
}

export const getServerSideProps = getServerSidePropsWithTracks;
