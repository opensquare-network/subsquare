import MembersList from "next-common/components/membersList/simpleMembersList";
import usePrime from "next-common/utils/hooks/usePrime";
import ListLayout from "next-common/components/layout/ListLayout";
import { getServerSidePropsWithTracks } from "next-common/services/serverSide";
import CollectiveProvider, { collectivePallets } from "next-common/context/collective";
import useCouncilMembers from "next-common/utils/hooks/useCouncilMembers";

export default function MembersPage() {
  return (
    <CollectiveProvider pallet={collectivePallets.technicalCommittee}>
      <MembersPageImpl />
    </CollectiveProvider>
  );
}

function MembersPageImpl() {
  const members = useCouncilMembers();
  const prime = usePrime();

  const category = "Technical Committee Members";
  const seoInfo = { title: category, desc: category };

  return (
    <ListLayout
      seoInfo={seoInfo}
      title={category}
      description="Technical committee members"
    >
      <MembersList prime={prime} items={members || []} loading={!members} />
    </ListLayout>
  );
}

export const getServerSideProps = getServerSidePropsWithTracks;
