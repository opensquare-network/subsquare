import PostList from "next-common/components/postList";
import { defaultPageSize, EmptyList } from "next-common/utils/constants";
import { withCommonProps } from "next-common/lib";
import nextApi from "next-common/services/nextApi";
import businessCategory from "next-common/utils/consts/business/category";
import normalizeProposalListItem from "next-common/utils/viewfuncs/democracy/normalizeProposalListItem";
import ListLayout from "next-common/components/layout/ListLayout";
import DemocracySummary from "next-common/components/summary/democracySummary";
import { fetchOpenGovTracksProps } from "next-common/services/serverSide";
import { useChain, useChainSettings } from "next-common/context/chain";
import Chains from "next-common/utils/consts/chains";
import NewDemocracyProposalButton from "next-common/components/summary/newDemocracyProposalButton";

export default function DemocracyProposalsPage({ proposals, summary }) {
  const {
    modules: { democracy },
  } = useChainSettings();
  const chain = useChain();
  const noProposeButton = [Chains.crust].includes(chain);

  const hasDemocracyModule = democracy && !democracy?.archived;

  const items = (proposals.items || []).map((item) =>
    normalizeProposalListItem(chain, item),
  );
  const category = businessCategory.democracyProposals;
  const title = category;
  const seoInfo = { title, desc: title };

  return (
    <ListLayout
      seoInfo={seoInfo}
      title={category}
      description="Democracy uses public proposal, external proposal and referenda to manage the governance process."
      summary={<DemocracySummary summary={summary} />}
    >
      <PostList
        category={category}
        title="List"
        titleCount={proposals.total}
        titleExtra={
          hasDemocracyModule &&
          !noProposeButton && <NewDemocracyProposalButton />
        }
        items={items}
        pagination={{
          page: proposals.page,
          pageSize: proposals.pageSize,
          total: proposals.total,
        }}
      />
    </ListLayout>
  );
}

export const getServerSideProps = withCommonProps(async (context) => {
  const { page, page_size: pageSize } = context.query;

  const { result: proposals } = await nextApi.fetch("democracy/proposals", {
    page: page ?? 1,
    pageSize: pageSize ?? defaultPageSize,
    simple: true,
  });
  const tracksProps = await fetchOpenGovTracksProps();

  return {
    props: {
      proposals: proposals ?? EmptyList,
      ...tracksProps,
    },
  };
});
