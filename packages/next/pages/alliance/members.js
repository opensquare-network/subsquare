import MembersList from "components/alliance/membersList";
import MemberSummary from "components/alliance/memberSummary";
import { useAllianceMembers } from "hooks/useAllianceMembers";
import ListLayout from "next-common/components/layout/ListLayout";
import { getServerSidePropsWithTracks } from "next-common/services/serverSide";

export default function MembersPage() {
  const { data, isLoading } = useAllianceMembers();
  const list = [
    ...(data?.fellow?.map?.((address) => ({ address, role: "Fellow" })) ?? []),
    ...(data?.ally?.map?.((address) => ({ address, role: "Ally" })) ?? []),
    ...(data?.retiring?.map?.((address) => ({
      address,
      role: "Retiring",
    })) ?? []),
  ];

  const category = "Members";
  const seoInfo = { title: category, desc: category };

  return (
    <ListLayout
      seoInfo={seoInfo}
      title={category}
      description="Alliance members by role."
      summary={
        <MemberSummary
          fellow={data?.fellow?.length}
          ally={data?.ally?.length}
          retiring={data?.retiring?.length}
        />
      }
    >
      <MembersList items={list} loading={isLoading} />
    </ListLayout>
  );
}

export const getServerSideProps = getServerSidePropsWithTracks;
