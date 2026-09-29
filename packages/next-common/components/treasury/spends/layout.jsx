import ListLayout from "next-common/components/layout/ListLayout";
import Link from "next-common/components/link";
import { PapiProvider } from "next-common/context/papi";
import TreasurySpendsSummary from "next-common/components/summary/treasurySpendsSummary";
import TreasurySpendsPendingNotice from "next-common/components/treasury/spends/treasurySpendsPendingNotice";
import { SelfContainedScheduledTreasurySpendPrompt } from "next-common/components/pages/components/scheduler/scheduledTreasurySpendPrompt";
import { CACHE_KEY } from "next-common/utils/constants";
import businessCategory from "next-common/utils/consts/business/category";

const tabs = [
  {
    value: "spends",
    label: "Spends",
    url: "/treasury/spends",
  },
  {
    value: "payout",
    label: "Payout Queues",
    url: "/treasury/spends/payout",
  },
];

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

export default function TreasurySpendsLayout({ children }) {
  const category = businessCategory.treasurySpends;
  const seoInfo = { title: category, desc: category };

  return (
    <ListLayout
      seoInfo={seoInfo}
      title={category}
      summary={<TreasurySpendsSummary />}
      summaryFooter={<SummaryFooter />}
      tabs={tabs}
    >
      {children}
    </ListLayout>
  );
}
