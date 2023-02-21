import { withLoginUser, withLoginUserRedux } from "next-common/lib";
import HomeLayout from "next-common/components/layout/HomeLayout";
import { TitleContainer } from "next-common/components/styled/containers/titleContainer";
import MembersList from "components/alliance/membersList";
import AllianceSummary from "components/alliance/summary";
import { useAllianceMembers } from "hooks/useAllianceMembers";

export default withLoginUserRedux(() => {
  const { data, isLoading } = useAllianceMembers();
  const list = [
    ...(data?.fellow || [])?.map((address) => ({ address, role: "Fellow" })),
    ...(data?.ally || [])?.map((address) => ({ address, role: "Ally" })),
    ...(data?.retiring || [])?.map((address) => ({
      address,
      role: "Retiring",
    })),
  ];

  const category = "Members";
  const seoInfo = { title: category, desc: category };

  return (
    <HomeLayout seoInfo={seoInfo}>
      <TitleContainer>{category}</TitleContainer>
      <AllianceSummary
        fellow={data?.fellow?.length}
        ally={data?.ally?.length}
        retiring={data?.retiring?.length}
      />
      <MembersList items={list} loading={isLoading} />
    </HomeLayout>
  );
});

export const getServerSideProps = withLoginUser(async (context) => {
  return {
    props: {},
  };
});
