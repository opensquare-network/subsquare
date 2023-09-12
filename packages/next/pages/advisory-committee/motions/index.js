import PostList from "next-common/components/postList";
import { withLoginUser, withLoginUserRedux } from "next-common/lib";
import { toAdvisoryMotionsListItem } from "utils/viewfuncs";
import businessCategory from "next-common/utils/consts/business/category";
import ListLayout from "next-common/components/layout/ListLayout";
import { useChainSettings } from "next-common/context/chain";
import ChainSocialLinks from "next-common/components/chain/socialLinks";
import { fetchList } from "next-common/services/list";

export default withLoginUserRedux(({ motions, chain }) => {
  const chainSettings = useChainSettings();

  const items = (motions.items || []).map((item) =>
    toAdvisoryMotionsListItem(chain, item),
  );
  const category = businessCategory.advisoryMotions;
  const seoInfo = {
    title: "Advisory Committee Motions",
    desc: "Advisory Committee Motions",
  };

  return (
    <ListLayout
      title={chainSettings.name}
      seoInfo={seoInfo}
      description={chainSettings.description}
      headContent={<ChainSocialLinks />}
    >
      <PostList
        category={category}
        items={items}
        pagination={{
          page: motions.page,
          pageSize: motions.pageSize,
          total: motions.total,
        }}
      />
    </ListLayout>
  );
});

export const getServerSideProps = withLoginUser(async (context) => {
  const motions = await fetchList("advisory-motions", context);

  return {
    props: {
      motions,
    },
  };
});
