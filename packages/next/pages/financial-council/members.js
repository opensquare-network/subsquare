import ListLayout from "next-common/components/layout/ListLayout";
import MembersList from "next-common/components/membersList/simpleMembersList";
import CollectiveProvider, { collectivePallets } from "next-common/context/collective";
import { getServerSidePropsWithTracks } from "next-common/services/serverSide";
import useCouncilMembers from "next-common/utils/hooks/useCouncilMembers";
import usePrime from "next-common/utils/hooks/usePrime";

export default function MembersPage() {
  return (
    <CollectiveProvider pallet={collectivePallets.financialCouncil}>
      <MembersPageImpl />
    </CollectiveProvider>
  );
}

function MembersPageImpl() {
  const category = "Financial Council Members";
  const seoInfo = { title: category, desc: category };

  const members = useCouncilMembers();
  const prime = usePrime();

  return (
    <ListLayout seoInfo={seoInfo} title={category}>
      <MembersList prime={prime} items={members || []} loading={!members} />
    </ListLayout>
  );
}

export const getServerSideProps = getServerSidePropsWithTracks;
