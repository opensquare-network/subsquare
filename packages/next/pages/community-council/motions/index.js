import PostList from "next-common/components/postList";
import { withCommonProps } from "next-common/lib";
import { toCommunityMotionsListItem } from "next-common/utils/viewfuncs";
import businessCategory from "next-common/utils/consts/business/category";
import ListLayout from "next-common/components/layout/ListLayout";
import { useChainSettings } from "next-common/context/chain";
import ChainSocialLinks from "next-common/components/chain/socialLinks";
import { fetchList } from "next-common/services/list";
import { fetchOpenGovTracksProps } from "next-common/services/serverSide";
import CollectiveProvider, {
  collectivePallets,
} from "next-common/context/collective";
import NewCouncilMotionProposalButton from "next-common/components/summary/newCouncilMotionProposalButton";

export default function MotionsPage({ motions }) {
  const chainSettings = useChainSettings();

  const items = (motions.items || []).map((item) =>
    toCommunityMotionsListItem(item),
  );
  const category = businessCategory.communityMotions;
  const seoInfo = {
    title: "Community Council Motions",
    desc: "Community Council Motions",
  };

  return (
    <CollectiveProvider pallet={collectivePallets.communityCouncil}>
      <ListLayout
        title={chainSettings.name}
        seoInfo={seoInfo}
        description={chainSettings.description}
        headContent={<ChainSocialLinks />}
      >
        <PostList
          category={category}
          titleExtra={<NewCouncilMotionProposalButton />}
          items={items}
          pagination={{
            page: motions.page,
            pageSize: motions.pageSize,
            total: motions.total,
          }}
        />
      </ListLayout>
    </CollectiveProvider>
  );
}

export const getServerSideProps = withCommonProps(async (context) => {
  const motions = await fetchList("community-council/motions", context);
  const tracksProps = await fetchOpenGovTracksProps();

  return {
    props: {
      motions,
      ...tracksProps,
    },
  };
});
