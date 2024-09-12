import PostList from "next-common/components/postList";
import { withCommonProps } from "next-common/lib";
import businessCategory from "next-common/utils/consts/business/category";
import normalizeTechCommMotionListItem from "next-common/utils/viewfuncs/collective/normalizeTechCommMotionListItem";
import ListLayout from "next-common/components/layout/ListLayout";
import { fetchOpenGovTracksProps } from "next-common/services/serverSide";
import { fetchList } from "next-common/services/list";
import CollectiveProvider, {
  collectivePallets,
} from "next-common/context/collective";
import NewCouncilMotionProposalButton from "next-common/components/summary/newCouncilMotionProposalButton";
import { TreasuryProvider } from "next-common/context/treasury";

export default function ProposalsPage({ proposals, chain }) {
  const items = (proposals.items || []).map((item) =>
    normalizeTechCommMotionListItem(chain, item),
  );
  const category = businessCategory.tcProposals;
  const seoInfo = {
    title: "Technical Committee Proposals",
    desc: "Technical Committee Proposals",
  };

  return (
    <CollectiveProvider pallet={collectivePallets.technicalCommittee}>
      <TreasuryProvider>
        <ListLayout
          seoInfo={seoInfo}
          title={category}
          description="Technical committee proposals"
        >
          <PostList
            category={category}
            title="List"
            titleCount={proposals.total}
            titleExtra={<NewCouncilMotionProposalButton />}
            items={items}
            pagination={{
              page: proposals.page,
              pageSize: proposals.pageSize,
              total: proposals.total,
            }}
          />
        </ListLayout>
      </TreasuryProvider>
    </CollectiveProvider>
  );
}

export const getServerSideProps = withCommonProps(async (context) => {
  const proposals = await fetchList("tech-comm/motions", context);
  const tracksProps = await fetchOpenGovTracksProps();

  return {
    props: {
      proposals,
      ...tracksProps,
    },
  };
});
