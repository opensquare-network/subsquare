import PostList from "next-common/components/postList";
import { EmptyList } from "next-common/utils/constants";
import { withLoginUser, withLoginUserRedux } from "next-common/lib";
import { ssrNextApi as nextApi } from "next-common/services/nextApi";
import { toTreasuryProposalListItem } from "utils/viewfuncs";
import Summary from "next-common/components/summary";
import PlusIcon from "public/imgs/icons/plusInCircle.svg";
import { useCallback, useEffect, useState } from "react";
import dynamic from "next/dynamic";
import { Create } from "next-common/components/treasury/common/styled";
import businessCategory from "next-common/utils/consts/business/category";
import HomeLayout from "next-common/components/layout/HomeLayout";
import useWaitSyncBlock from "next-common/utils/hooks/useWaitSyncBlock";
import useIsMounted from "next-common/utils/hooks/useIsMounted";

const Popup = dynamic(
  () => import("next-common/components/treasury/proposal/popup"),
  {
    ssr: false,
  }
);

export default withLoginUserRedux(({ proposals: ssrProposals, chain }) => {
  const [showPopup, setShowPopup] = useState(false);
  const [proposals, setProposals] = useState(ssrProposals);
  useEffect(() => setProposals(ssrProposals), [ssrProposals]);
  const isMounted = useIsMounted();

  const items = (proposals.items || []).map((item) =>
    toTreasuryProposalListItem(chain, item)
  );

  const create = (
    <Create onClick={() => setShowPopup(true)}>
      <PlusIcon />
      New Proposal
    </Create>
  );

  const refreshPageData = useCallback(async () => {
    const { result } = await nextApi.fetch(`treasury/proposals`);
    if (result && isMounted.current) {
      setProposals(result);
    }
  }, [isMounted]);

  const onProposeFinalized = useWaitSyncBlock(
    "Proposal proposed",
    refreshPageData
  );

  const category = businessCategory.treasuryProposals;
  const seoInfo = { title: category, desc: category };

  return (
    <HomeLayout seoInfo={seoInfo}>
      <PostList
        category={category}
        create={create}
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
});

export const getServerSideProps = withLoginUser(async (context) => {
  const chain = process.env.CHAIN;

  const { page, page_size: pageSize } = context.query;

  const [{ result: proposals }] = await Promise.all([
    nextApi.fetch(`treasury/proposals`, {
      page: page ?? 1,
      pageSize: pageSize ?? 50,
    }),
  ]);

  return {
    props: {
      chain,
      proposals: proposals ?? EmptyList,
    },
  };
});
