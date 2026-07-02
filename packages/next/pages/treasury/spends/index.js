import { withCommonProps } from "next-common/lib";
import { fetchList } from "next-common/services/list";
import { fetchOpenGovTracksProps } from "next-common/services/serverSide";
import ListLayout from "next-common/components/layout/ListLayout";
import TreasurySpendsPostList from "next-common/components/postList/treasurySpendsPostList";
import normalizeTreasurySpendListItem from "next-common/utils/viewfuncs/treasury/normalizeTreasurySpendListItem";
import { TreasuryProvider } from "next-common/context/treasury";
import { DropdownUrlFilterProvider } from "next-common/components/dropdownFilter/context";
import { upperFirst } from "lodash-es";
import businessCategory from "next-common/utils/consts/business/category";
import TreasurySpendsSummary from "next-common/components/summary/treasurySpendsSummary";
import TreasurySpendsPendingNotice from "next-common/components/treasury/spends/treasurySpendsPendingNotice";
import { PapiProvider } from "next-common/context/papi";
import { SelfContainedScheduledTreasurySpendPrompt } from "next-common/components/pages/components/scheduler/scheduledTreasurySpendPrompt";
import { CACHE_KEY } from "next-common/utils/constants";
import Link from "next-common/components/link";
import PendingSpendsProvider from "next-common/components/postList/treasurySpendsPostList/pendingContext";

function SummaryFooter() {
  return (
    <div className="flex flex-col gap-2">
      <TreasurySpendsPendingNotice />
      <PapiProvider>
        <SelfContainedScheduledTreasurySpendPrompt
          cacheKey={CACHE_KEY.scheduledTreasurySpendPromptOnSpendList}
        >
          <span>
            , check{" "}
            <Link className="underline" href="/scheduler">
              here
            </Link>
          </span>
        </SelfContainedScheduledTreasurySpendPrompt>
      </PapiProvider>
    </div>
  );
}

export default function ProposalsPage({ spends: pagedSpends, chain }) {
  const { items, total, page, pageSize } = pagedSpends;
  const spends = (items || []).map((item) =>
    normalizeTreasurySpendListItem(chain, item),
  );
  const category = businessCategory.treasurySpends;
  const seoInfo = { title: category, desc: category };

  return (
    <TreasuryProvider>
      <PendingSpendsProvider>
        <ListLayout
          seoInfo={seoInfo}
          title={category}
          summary={<TreasurySpendsSummary />}
          summaryFooter={<SummaryFooter />}
        >
          <DropdownUrlFilterProvider
            defaultFilterValues={{ status: "", valid_only: false, ids: "" }}
            shallow={false}
          >
            <TreasurySpendsPostList
              titleCount={total}
              items={spends}
              pagination={{ page, pageSize, total }}
            />
          </DropdownUrlFilterProvider>
        </ListLayout>
      </PendingSpendsProvider>
    </TreasuryProvider>
  );
}

export const getServerSideProps = withCommonProps(async (context) => {
  const { status, valid_only, ids } = context.query;
  const query = {};
  if (status) {
    query.status = upperFirst(status);
  }
  if (valid_only === "true") {
    query.valid_only = true;
    query.ids = ids?.replaceAll("_", ",") ?? ids;
  }
  const [spends, tracksProps] = await Promise.all([
    await fetchList("treasury/spends", context, query),
    await fetchOpenGovTracksProps(),
  ]);

  return {
    props: {
      spends,
      ...tracksProps,
    },
  };
});
