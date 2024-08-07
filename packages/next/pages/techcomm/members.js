import MembersList from "next-common/components/membersList/simpleMembersList";
import useCall from "next-common/utils/hooks/useCall";
import usePrime from "next-common/utils/hooks/usePrime";
import { detailPageCategory } from "next-common/utils/consts/business/category";
import ListLayout from "next-common/components/layout/ListLayout";
import toApiCouncil from "next-common/utils/toApiCouncil";
import { getServerSidePropsWithTracks } from "next-common/services/serverSide";
import { useContextApi } from "next-common/context/api";

export default function MembersPage() {
  const chain = process.env.NEXT_PUBLIC_CHAIN;
  const type = detailPageCategory.TECH_COMM_MOTION;
  const api = useContextApi();
  const councilName = toApiCouncil(chain, type);
  const { value: members, loading: loadingMembers } = useCall(
    api?.query?.[councilName]?.members,
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
