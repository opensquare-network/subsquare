import PostList from "next-common/components/postList";
import { defaultPageSize, EmptyList } from "next-common/utils/constants";
import { withLoginUser, withLoginUserRedux } from "next-common/lib";
import { ssrNextApi as nextApi } from "next-common/services/nextApi";
import { toAdvisoryMotionsListItem } from "utils/viewfuncs";
import businessCategory from "next-common/utils/consts/business/category";
import ListLayout from "next-common/components/layout/ListLayout";
import { useChainSettings } from "next-common/context/chain";
import ChainSocialLinks from "next-common/components/chain/socialLinks";

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
  const chain = process.env.CHAIN;

  const { page, page_size: pageSize } = context.query;

  const { result: motions } = await nextApi.fetch("advisory-motions", {
    page: page ?? 1,
    pageSize: pageSize ?? defaultPageSize,
  });

  return {
    props: {
      chain,
      motions: motions ?? EmptyList,
    },
  };
});
