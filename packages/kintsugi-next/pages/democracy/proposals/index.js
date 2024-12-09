import PostList from "next-common/components/postList";
import { EmptyList } from "next-common/utils/constants";
import { withCommonProps } from "next-common/lib";
import nextApi from "next-common/services/nextApi";
import DemocracySummary from "next-common/components/summary/democracySummary";
import { useChain } from "next-common/context/chain";
import KintsugiDemocracyStaking from "components/summary/kintsugiDemocracyStaking";
import normalizeProposalListItem from "next-common/utils/viewfuncs/democracy/normalizeProposalListItem";
import ListLayout from "next-common/components/layout/ListLayout";
import businessCategory from "next-common/utils/consts/business/category";
import NewDemocracyProposalButton from "components/democracy/proposals/newDemoracyProposalButton";
import { useIsLoggedIn } from "next-common/context/user";

export default function DemocracyProposalsPage({ proposals, summary }) {
  const chain = useChain();
  const items = (proposals.items || []).map((item) =>
    normalizeProposalListItem(chain, item),
  );
  const category = businessCategory.democracyProposals;
  const title = category;
  const seoInfo = { title, desc: title };
  const isLoggedIn = useIsLoggedIn();

  return (
    <ListLayout
      seoInfo={seoInfo}
      title={category}
      description="Democracy uses public proposal, external proposal and referenda to mange the governance process."
      summary={<DemocracySummary summary={summary} />}
      summaryFooter={isLoggedIn ? <KintsugiDemocracyStaking /> : null}
    >
      <PostList
        category={category}
        title="List"
        titleCount={proposals.total}
        titleExtra={<NewDemocracyProposalButton />}
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

  const [{ result: proposals }, { result: summary }] = await Promise.all([
    nextApi.fetch("democracy/proposals", {
      page: page ?? 1,
      pageSize: pageSize ?? 50,
      simple: true,
    }),
    nextApi.fetch("summary"),
  ]);

  return {
    props: {
      proposals: proposals ?? EmptyList,
      summary: summary ?? {},
    },
  };
});
