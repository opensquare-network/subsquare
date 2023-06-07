import { useCallback, useEffect, useState } from "react";
import PostList from "next-common/components/postList";
import { defaultPageSize, EmptyList } from "next-common/utils/constants";
import { withLoginUser, withLoginUserRedux } from "next-common/lib";
import nextApi, { ssrNextApi } from "next-common/services/nextApi";
import Summary from "next-common/components/summary";
import { Create } from "next-common/components/treasury/common/styled";
import dynamic from "next/dynamic";
import PlusIcon from "public/imgs/icons/plusInCircle.svg";
import HomeLayout from "next-common/components/layout/HomeLayout";
import useIsMounted from "next-common/utils/hooks/useIsMounted";
import useWaitSyncBlock from "next-common/utils/hooks/useWaitSyncBlock";
import { useChain, useChainSettings } from "next-common/context/chain";
import normalizeTipListItem from "next-common/utils/viewfuncs/treasury/normalizeTipListItem";
import { fellowshipTracksApi, gov2TracksApi } from "next-common/services/url";
import styled from "styled-components";
import {
  flex,
  gap_x,
  hidden,
  items_center,
} from "next-common/styles/tailwindcss";
import StatisticLinkButton from "next-common/components/statisticsLinkButton";
import { lowerCase } from "lodash";
import { smcss } from "next-common/utils/responsive";

const Popup = dynamic(
  () => import("next-common/components/treasury/tip/popup"),
  {
    ssr: false,
  },
);

const CategoryExtraWrapper = styled.div`
  ${flex};
  ${items_center};
  ${gap_x(16)};
`;

const NewLabel = styled.span`
  .abbreviate {
    ${smcss(hidden)}
  }
`;

export default withLoginUserRedux(
  ({ tips: ssrTips, tracks, fellowshipTracks }) => {
    const chain = useChain();
    const [showPopup, setShowPopup] = useState(false);
    const [tips, setTips] = useState(ssrTips);
    useEffect(() => setTips(ssrTips), [ssrTips]);
    const isMounted = useIsMounted();
    const chainSettings = useChainSettings();

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

    const categoryExtra = (
      <CategoryExtraWrapper>
        <Create onClick={() => setShowPopup(true)}>
          <PlusIcon />
          <NewLabel>
            New <span className="abbreviate">Tip</span>
          </NewLabel>
        </Create>

        {chainSettings.hasDotreasury && (
          <StatisticLinkButton
            href={`https://dotreasury.com/${lowerCase(
              chainSettings.symbol,
            )}/tips`}
          />
        )}
      </CategoryExtraWrapper>
    );

    const category = "Tips";
    const seoInfo = { title: "Treasury Tips", desc: "Treasury Tips" };

    return (
      <HomeLayout
        seoInfo={seoInfo}
        tracks={tracks}
        fellowshipTracks={fellowshipTracks}
      >
        <PostList
          category={category}
          topRightCorner={categoryExtra}
          items={items}
          summary={<Summary />}
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
      </HomeLayout>
    );
  },
);

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
