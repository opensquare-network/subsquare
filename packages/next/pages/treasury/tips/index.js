import { useCallback, useEffect, useState } from "react";
import PostList from "next-common/components/postList";
import { withLoginUser, withLoginUserRedux } from "next-common/lib";
import nextApi from "next-common/services/nextApi";
import dynamic from "next/dynamic";
import useIsMounted from "next-common/utils/hooks/useIsMounted";
import useWaitSyncBlock from "next-common/utils/hooks/useWaitSyncBlock";
import { useChain, useChainSettings } from "next-common/context/chain";
import normalizeTipListItem from "next-common/utils/viewfuncs/treasury/normalizeTipListItem";
import { lowerCase } from "lodash";
import ListLayout from "next-common/components/layout/ListLayout";
import PrimaryButton from "next-common/components/buttons/primaryButton";
import { SystemPlus } from "@osn/icons/subsquare";
import TreasurySummary from "next-common/components/summary/treasurySummary";
import useHasTips from "next-common/hooks/treasury/useHasTips";
import { fetchOpenGovTracksProps } from "next-common/services/serverSide";
import { fetchList } from "next-common/services/list";

const Popup = dynamic(
  () => import("next-common/components/treasury/tip/popup"),
  {
    ssr: false,
  },
);

export default withLoginUserRedux(({ tips: ssrTips }) => {
  const chain = useChain();
  const [showPopup, setShowPopup] = useState(false);
  const [tips, setTips] = useState(ssrTips);
  useEffect(() => setTips(ssrTips), [ssrTips]);
  const isMounted = useIsMounted();
  const { hasDotreasury, symbol, hideActionButtons } = useChainSettings();
  const hasTips = useHasTips();

  const refreshPageData = useCallback(async () => {
    const { result } = await nextApi.fetch("treasury/tips");
    if (result && isMounted.current) {
      setTips(result);
    }
  }, [isMounted]);

  const onNewTipFinalized = useWaitSyncBlock("Tip created", refreshPageData);

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
              small
              icon={
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
      {showPopup && (
        <Popup
          onClose={() => setShowPopup(false)}
          onFinalized={onNewTipFinalized}
        />
      )}
    </ListLayout>
  );
});

export const getServerSideProps = withLoginUser(async (context) => {
  const tips = await fetchList("treasury/tips", context);
  const tracksProps = await fetchOpenGovTracksProps();

  return {
    props: {
      tips,
      ...tracksProps,
    },
  };
});
