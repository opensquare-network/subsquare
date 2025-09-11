import { useEffect, useState } from "react";
import TreasuryTipsPostList, {
  NewTipButtonExtra,
} from "next-common/components/postList/treasuryTipsPostList";
import { withCommonProps } from "next-common/lib";
import { useChain, useChainSettings } from "next-common/context/chain";
import normalizeTipListItem from "next-common/utils/viewfuncs/treasury/normalizeTipListItem";
import { lowerCase } from "lodash-es";
import ListLayout from "next-common/components/layout/ListLayout";
import TreasurySummary from "next-common/components/summary/treasurySummary";
import { fetchOpenGovTracksProps } from "next-common/services/serverSide";
import { fetchList } from "next-common/services/list";
import { TreasuryProvider } from "next-common/context/treasury";
import CollectiveProvider, {
  collectivePallets,
} from "next-common/context/collective";
import Chains from "next-common/utils/consts/chains";

export default function TipsPage({ tips: ssrTips }) {
  const chain = useChain();
  const [tips, setTips] = useState(ssrTips);
  useEffect(() => setTips(ssrTips), [ssrTips]);
  const { integrations, symbol } = useChainSettings();

  const items = (tips.items || []).map((item) =>
    normalizeTipListItem(chain, item),
  );

  const seoInfo = { title: "Treasury Tips", desc: "Treasury Tips" };

  let pallet = collectivePallets.council;
  if ([Chains.acala, Chains.karura].includes(chain)) {
    pallet = collectivePallets.generalCouncil;
  }

  return (
    <CollectiveProvider pallet={pallet}>
      <TreasuryProvider>
        <ListLayout
          seoInfo={seoInfo}
          title={seoInfo.title}
          summary={<TreasurySummary />}
          tabs={[
            {
              value: "tips",
              label: "Tips",
              url: "/treasury/tips",
            },
            integrations?.doTreasury && {
              value: "statistics",
              label: "Statistics",
              url: `https://dotreasury.com/${lowerCase(symbol)}/tips`,
            },
          ].filter(Boolean)}
        >
          <TreasuryTipsPostList
            titleCount={tips.total}
            items={items}
            pagination={{
              page: tips.page,
              pageSize: tips.pageSize,
              total: tips.total,
            }}
            titleExtra={<NewTipButtonExtra />}
          />
        </ListLayout>
      </TreasuryProvider>
    </CollectiveProvider>
  );
}

export const getServerSideProps = withCommonProps(async (context) => {
  const tips = await fetchList("treasury/tips", context);
  const tracksProps = await fetchOpenGovTracksProps();

  return {
    props: {
      tips,
      ...tracksProps,
    },
  };
});
