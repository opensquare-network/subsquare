import { useCallback, useEffect, useState } from "react";
import PostList from "next-common/components/postList";
import { EmptyList } from "next-common/utils/constants";
import { withLoginUser, withLoginUserRedux } from "next-common/lib";
import nextApi, { ssrNextApi } from "next-common/services/nextApi";
import { toTipListItem } from "utils/viewfuncs";
import Summary from "next-common/components/summary";
import { Create } from "next-common/components/treasury/common/styled";
import dynamic from "next/dynamic";
import PlusIcon from "public/imgs/icons/plusInCircle.svg";
import HomeLayout from "next-common/components/layout/HomeLayout";
import useIsMounted from "next-common/utils/hooks/useIsMounted";
import useWaitSyncBlock from "next-common/utils/hooks/useWaitSyncBlock";

const Popup = dynamic(
  () => import("next-common/components/treasury/tip/popup"),
  {
    ssr: false,
  }
);

export default withLoginUserRedux(({ loginUser, tips: ssrTips, chain }) => {
  const [showPopup, setShowPopup] = useState(false);
  const [tips, setTips] = useState(ssrTips);
  useEffect(() => setTips(ssrTips), [ssrTips]);
  const isMounted = useIsMounted();

  const refreshPageData = useCallback(
    async () => {
        const { result } = await nextApi.fetch(`treasury/tips`);
        if (result && isMounted.current) {
          setTips(result);
        }
    },
    [isMounted]
  );

  const onNewTipFinalized = useWaitSyncBlock("Tip created", refreshPageData);

  const items = (tips.items || []).map((item) => toTipListItem(chain, item));
  const category = "Tips";
  const seoInfo = { title: `Treasury Tips`, desc: `Treasury Tips` };

  const create = (
    <Create onClick={() => setShowPopup(true)}>
      <PlusIcon />
      New Tip
    </Create>
  );

  return (
    <HomeLayout user={loginUser} seoInfo={seoInfo}>
      <PostList
        chain={chain}
        category={category}
        create={create}
        items={items}
        summary={<Summary chain={chain} />}
        pagination={{
          page: tips.page,
          pageSize: tips.pageSize,
          total: tips.total,
        }}
      />
      {showPopup && (
        <Popup
          chain={chain}
          onClose={() => setShowPopup(false)}
          onFinalized={onNewTipFinalized}
        />
      )}
    </HomeLayout>
  );
});

export const getServerSideProps = withLoginUser(async (context) => {
  const chain = process.env.CHAIN;

  const { page, page_size: pageSize } = context.query;

  const [{ result: tips }] = await Promise.all([
    ssrNextApi.fetch(`treasury/tips`, {
      page: page ?? 1,
      pageSize: pageSize ?? 50,
    }),
  ]);

  return {
    props: {
      chain,
      tips: tips ?? EmptyList,
    },
  };
});
