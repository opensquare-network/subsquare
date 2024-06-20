import { useEffect, useState } from "react";
import PostList from "next-common/components/postList";
import { withCommonProps } from "next-common/lib";
import { useChain, useChainSettings } from "next-common/context/chain";
import normalizeTipListItem from "next-common/utils/viewfuncs/treasury/normalizeTipListItem";
import { lowerCase } from "lodash-es";
import ListLayout from "next-common/components/layout/ListLayout";
import PrimaryButton from "next-common/lib/button/primary";
import { SystemPlus } from "@osn/icons/subsquare";
import TreasurySummary from "next-common/components/summary/treasurySummary";
import useHasTips from "next-common/hooks/treasury/useHasTips";
import { fetchOpenGovTracksProps } from "next-common/services/serverSide";
import { fetchList } from "next-common/services/list";
import dynamicPopup from "next-common/lib/dynamic/popup";

const Popup = dynamicPopup(() =>
  import("next-common/components/treasury/tip/popup"),
);

export default function TipsPage({ tips: ssrTips }) {
  const chain = useChain();
  const [showPopup, setShowPopup] = useState(false);
  const [tips, setTips] = useState(ssrTips);
  useEffect(() => setTips(ssrTips), [ssrTips]);
  const { hasDotreasury, symbol, hideActionButtons } = useChainSettings();
  const hasTips = useHasTips();

  const items = (tips.items || []).map((item) =>
    normalizeTipListItem(chain, item),
  );

  const category = "Tips";
  const seoInfo = { title: "Treasury Tips", desc: "Treasury Tips" };

  return (
    <ListLayout
      seoInfo={seoInfo}
      title={seoInfo.title}
      summary={<TreasurySummary />}
      summaryFooter={
        !hideActionButtons &&
        hasTips && (
          <div className="flex justify-end">
            <PrimaryButton
              size="small"
              iconLeft={
                <SystemPlus className="w-4 h-4 [&_path]:fill-textPrimaryContrast" />
              }
              onClick={() => setShowPopup(true)}
            >
              New Tip
            </PrimaryButton>
          </div>
        )
      }
      tabs={[
        {
          label: "Tips",
          url: "/treasury/tips",
        },
        hasDotreasury && {
          label: "Statistics",
          url: `https://dotreasury.com/${lowerCase(symbol)}/tips`,
        },
      ].filter(Boolean)}
    >
      <PostList
        category={category}
        title="List"
        titleCount={tips.total}
        items={items}
        pagination={{
          page: tips.page,
          pageSize: tips.pageSize,
          total: tips.total,
        }}
      />
      {showPopup && <Popup onClose={() => setShowPopup(false)} />}
    </ListLayout>
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
