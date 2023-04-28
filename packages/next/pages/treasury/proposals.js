import { useCallback, useEffect, useState } from "react";
import PostList from "next-common/components/postList";
import { defaultPageSize, EmptyList } from "next-common/utils/constants";
import { withLoginUser, withLoginUserRedux } from "next-common/lib";
import nextApi, { ssrNextApi } from "next-common/services/nextApi";
import Summary from "next-common/components/summary";
import PlusIcon from "public/imgs/icons/plusInCircle.svg";
import dynamic from "next/dynamic";
import { Create } from "next-common/components/treasury/common/styled";
import HomeLayout from "next-common/components/layout/HomeLayout";
import useIsMounted from "next-common/utils/hooks/useIsMounted";
import useWaitSyncBlock from "next-common/utils/hooks/useWaitSyncBlock";
import normalizeTreasuryProposalListItem from "next-common/utils/viewfuncs/treasury/normalizeProposalListItem";
import { fellowshipTracksApi, gov2TracksApi } from "next-common/services/url";

const Popup = dynamic(
  () => import("next-common/components/treasury/proposal/popup"),
  {
    ssr: false,
  }
);

export default withLoginUserRedux(
  ({ proposals: ssrProposals, chain, tracks, fellowshipTracks }) => {
    const [showPopup, setShowPopup] = useState(false);
    const [proposals, setProposals] = useState(ssrProposals);
    useEffect(() => setProposals(ssrProposals), [ssrProposals]);
    const isMounted = useIsMounted();

    const items = (proposals.items || []).map((item) =>
      normalizeTreasuryProposalListItem(chain, item)
    );

    const refreshPageData = useCallback(async () => {
      const { result } = await nextApi.fetch("treasury/proposals");
      if (result && isMounted.current) {
        setProposals(result);
      }
    }, [isMounted]);

    const onProposeFinalized = useWaitSyncBlock(
      "Proposal proposed",
      refreshPageData
    );

    const create = (
      <Create onClick={() => setShowPopup(true)}>
        <PlusIcon />
        New Proposal
      </Create>
    );

    const category = "Treasury Proposals";
    const seoInfo = { title: category, desc: category };

    return (
      <HomeLayout
        seoInfo={seoInfo}
        tracks={tracks}
        fellowshipTracks={fellowshipTracks}
      >
        <PostList
          category={category}
          topRightCorner={create}
          items={items}
          summary={<Summary />}
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
      </HomeLayout>
    );
  }
);

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
