import MembersList from "next-common/components/membersList/simpleMembersList";
import useCall from "next-common/utils/hooks/useCall";
import usePrime from "next-common/utils/hooks/usePrime";
import ListLayout from "next-common/components/layout/ListLayout";
import { getServerSidePropsWithTracks } from "next-common/services/serverSide";
import { useContextApi } from "next-common/context/api";
import CollectiveProvider, {
  useCollectivePallet,
} from "next-common/context/collective";

export default function MembersPage() {
  return (
    <CollectiveProvider pallet="technicalCommittee">
      <MembersPageImpl />
    </CollectiveProvider>
  );
}

function MembersPageImpl() {
  const api = useContextApi();
  const pallet = useCollectivePallet();
  const { value: members, loading: loadingMembers } = useCall(
    api?.query?.[pallet]?.members,
    [],
  );
  const data = members?.toJSON() || [];
  const prime = usePrime();

  const category = "Technical Committee Members";
  const seoInfo = { title: category, desc: category };

  return (
    <ListLayout
      seoInfo={seoInfo}
      title={category}
      description="Technical committee members"
    >
      <MembersList prime={prime} items={data} loading={loadingMembers} />
    </ListLayout>
  );
}

export const getServerSideProps = getServerSidePropsWithTracks;
