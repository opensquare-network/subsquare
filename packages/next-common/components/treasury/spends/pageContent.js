import ListLayout from "next-common/components/layout/ListLayout";
import Link from "next-common/components/link";
import TreasurySpendsPostList from "next-common/components/postList/treasurySpendsPostList";
import { DropdownUrlFilterProvider } from "next-common/components/dropdownFilter/context";
import { PapiProvider } from "next-common/context/papi";
import useTreasurySpendsList from "next-common/hooks/treasury/useTreasurySpendsList";
import TreasurySpendsSummary from "next-common/components/summary/treasurySpendsSummary";
import TreasurySpendsPendingNotice from "next-common/components/treasury/spends/treasurySpendsPendingNotice";
import { SelfContainedScheduledTreasurySpendPrompt } from "next-common/components/pages/components/scheduler/scheduledTreasurySpendPrompt";
import { CACHE_KEY } from "next-common/utils/constants";
import businessCategory from "next-common/utils/consts/business/category";
import normalizeTreasurySpendListItem from "next-common/utils/viewfuncs/treasury/normalizeTreasurySpendListItem";
import Loading from "next-common/components/loading";

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

export default function TreasurySpendsPageContent({ chain }) {
  const { spends: pagedSpends, loading } = useTreasurySpendsList();
  const { items, total, page, pageSize } = pagedSpends;
  const spends = (items || []).map((item) =>
    normalizeTreasurySpendListItem(chain, item),
  );
  const category = businessCategory.treasurySpends;
  const seoInfo = { title: category, desc: category };
  const showLoading = loading && !items?.length;

  return (
    <ListLayout
      seoInfo={seoInfo}
      title={category}
      summary={<TreasurySpendsSummary />}
      summaryFooter={<SummaryFooter />}
    >
      <DropdownUrlFilterProvider
        defaultFilterValues={{ status: "", valid_only: false, page: "" }}
        shallow
      >
        {showLoading ? (
          <div className="flex justify-center py-6">
            <Loading size={20} />
          </div>
        ) : (
          <TreasurySpendsPostList
            titleCount={total}
            items={spends}
            pagination={{ page, pageSize, total, shallow: true }}
          />
        )}
      </DropdownUrlFilterProvider>
    </ListLayout>
  );
}
