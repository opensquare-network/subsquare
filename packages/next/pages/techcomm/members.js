import MembersList from "next-common/components/membersList/simpleMembersList";
import { withLoginUser, withLoginUserRedux } from "next-common/lib";
import useApi from "next-common/utils/hooks/useApi";
import useCall from "next-common/utils/hooks/useCall";
import usePrime from "next-common/utils/hooks/usePrime";
import { detailPageCategory } from "next-common/utils/consts/business/category";
import ListLayout from "next-common/components/layout/ListLayout";
import { ssrNextApi as nextApi } from "next-common/services/nextApi";
import { fellowshipTracksApi, gov2TracksApi } from "next-common/services/url";
import toApiCouncil from "next-common/utils/toApiCouncil";

export default withLoginUserRedux(() => {
  const chain = process.env.NEXT_PUBLIC_CHAIN;
  const type = detailPageCategory.OPEN_TECH_COMM_PROPOSAL;
  const api = useApi();
  const councilName = toApiCouncil(chain, type);
  const [members, loadingMembers] = useCall(
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
});

export const getServerSideProps = withLoginUser(async (context) => {
  const [{ result: tracks }, { result: fellowshipTracks }] = await Promise.all([
    nextApi.fetch(gov2TracksApi),
    nextApi.fetch(fellowshipTracksApi),
  ]);

  return {
    props: {
      tracks: tracks ?? [],
      fellowshipTracks: fellowshipTracks ?? [],
    },
  };
});
