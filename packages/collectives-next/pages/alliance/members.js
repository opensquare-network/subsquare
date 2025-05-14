import MembersList from "next-common/components/pages/components/alliance/membersList";
import MemberSummary from "next-common/components/pages/components/alliance/memberSummary";
import { useAllianceMembers } from "next-common/hooks/pages/useAllianceMembers";
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
