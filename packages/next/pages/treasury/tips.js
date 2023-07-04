import { useCallback, useEffect, useState } from "react";
import PostList from "next-common/components/postList";
import { defaultPageSize, EmptyList } from "next-common/utils/constants";
import { withLoginUser, withLoginUserRedux } from "next-common/lib";
import nextApi, { ssrNextApi } from "next-common/services/nextApi";
import dynamic from "next/dynamic";
import useIsMounted from "next-common/utils/hooks/useIsMounted";
import useWaitSyncBlock from "next-common/utils/hooks/useWaitSyncBlock";
import { useChain, useChainSettings } from "next-common/context/chain";
import normalizeTipListItem from "next-common/utils/viewfuncs/treasury/normalizeTipListItem";
import { fellowshipTracksApi, gov2TracksApi } from "next-common/services/url";
import { lowerCase } from "lodash";
import ListLayout from "next-common/components/layout/ListLayout";
import ThemeButton from "next-common/components/buttons/themeButton";
import { SystemPlus } from "@osn/icons/subsquare";
import TreasurySummary from "next-common/components/summary/treasurySummary";

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

  const category = "Treasury Tips";
  const seoInfo = { title: "Treasury Tips", desc: "Treasury Tips" };

  return (
    <ListLayout
      seoInfo={seoInfo}
      title={category}
      summary={<TreasurySummary />}
      summaryFooter={
        !hideActionButtons && (
          <div className="flex justify-end">
            <ThemeButton
              small
              icon={
                <SystemPlus className="w-4 h-4 [&_path]:fill-textPrimaryContrast" />
              }
              onClick={() => setShowPopup(true)}
            >
              New Tip
            </ThemeButton>
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
  const { page, page_size: pageSize } = context.query;

  const [{ result: tips }] = await Promise.all([
    ssrNextApi.fetch("treasury/tips", {
      page: page ?? 1,
      pageSize: pageSize ?? defaultPageSize,
    }),
  ]);

  const [{ result: tracks }, { result: fellowshipTracks }] = await Promise.all([
    nextApi.fetch(gov2TracksApi),
    nextApi.fetch(fellowshipTracksApi),
  ]);

  return {
    props: {
      tips: tips ?? EmptyList,
      tracks: tracks ?? [],
      fellowshipTracks: fellowshipTracks ?? [],
    },
  };
});
