import { useCallback, useEffect, useState } from "react";
import PostList from "next-common/components/postList";
import { defaultPageSize, EmptyList } from "next-common/utils/constants";
import { withLoginUser, withLoginUserRedux } from "next-common/lib";
import nextApi, { ssrNextApi } from "next-common/services/nextApi";
import TreasurySummary from "next-common/components/summary";
import dynamic from "next/dynamic";
import useIsMounted from "next-common/utils/hooks/useIsMounted";
import useWaitSyncBlock from "next-common/utils/hooks/useWaitSyncBlock";
import normalizeTreasuryProposalListItem from "next-common/utils/viewfuncs/treasury/normalizeProposalListItem";
import { fellowshipTracksApi, gov2TracksApi } from "next-common/services/url";
import { useChainSettings } from "next-common/context/chain";
import { lowerCase } from "lodash";
import ListLayout from "next-common/components/layout/ListLayout";
import ThemeButton from "next-common/components/buttons/themeButton";
import { SystemPlus } from "@osn/icons/subsquare";

const Popup = dynamic(
  () => import("next-common/components/treasury/proposal/popup"),
  {
    ssr: false,
  },
);

export default withLoginUserRedux(({ proposals: ssrProposals, chain }) => {
  const [showPopup, setShowPopup] = useState(false);
  const [proposals, setProposals] = useState(ssrProposals);
  useEffect(() => setProposals(ssrProposals), [ssrProposals]);
  const isMounted = useIsMounted();
  const chainSettings = useChainSettings();

  const items = (proposals.items || []).map((item) =>
    normalizeTreasuryProposalListItem(chain, item),
  );

  const refreshPageData = useCallback(async () => {
    const { result } = await nextApi.fetch("treasury/proposals");
    if (result && isMounted.current) {
      setProposals(result);
    }
  }, [isMounted]);

  const onProposeFinalized = useWaitSyncBlock(
    "Proposal proposed",
    refreshPageData,
  );

  const category = "Treasury Proposals";
  const seoInfo = { title: category, desc: category };

  return (
    <ListLayout
      seoInfo={seoInfo}
      title={category}
      summary={<TreasurySummary />}
      summaryFooter={
        <div className="flex justify-end">
          <ThemeButton
            small
            icon={
              <SystemPlus className="w-4 h-4 [&_path]:fill-textPrimaryContrast" />
            }
            onClick={() => setShowPopup(true)}
          >
            New Proposal
          </ThemeButton>
        </div>
      }
      tabs={[
        { label: "Proposals", url: "/treasury/proposals" },
        chainSettings.hasDotreasury && {
          label: "Statistics",
          url: `https://dotreasury.com/${lowerCase(
            chainSettings.symbol,
          )}/proposals`,
        },
      ].filter(Boolean)}
    >
      <PostList
        category={category}
        title="List"
        items={items}
        pagination={{
          page: proposals.page,
          pageSize: proposals.pageSize,
          total: proposals.total,
        }}
      />
      {showPopup && (
        <Popup
          onClose={() => setShowPopup(false)}
          onFinalized={onProposeFinalized}
        />
      )}
    </ListLayout>
  );
});

export const getServerSideProps = withLoginUser(async (context) => {
  const chain = process.env.CHAIN;

  const { page, page_size: pageSize } = context.query;

  const [{ result: proposals }] = await Promise.all([
    ssrNextApi.fetch("treasury/proposals", {
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
      chain,
      proposals: proposals ?? EmptyList,
      tracks: tracks ?? [],
      fellowshipTracks: fellowshipTracks ?? [],
    },
  };
});
