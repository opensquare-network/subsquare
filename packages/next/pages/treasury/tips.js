import { useCallback, useEffect, useState } from "react";
import PostList from "next-common/components/postList";
import { EmptyList } from "next-common/utils/constants";
import { withLoginUser, withLoginUserRedux } from "next-common/lib";
import nextApi, { ssrNextApi } from "next-common/services/nextApi";
import Summary from "next-common/components/summary";
import { Create } from "next-common/components/treasury/common/styled";
import dynamic from "next/dynamic";
import PlusIcon from "public/imgs/icons/plusInCircle.svg";
import HomeLayout from "next-common/components/layout/HomeLayout";
import useIsMounted from "next-common/utils/hooks/useIsMounted";
import useWaitSyncBlock from "next-common/utils/hooks/useWaitSyncBlock";
import { useChain } from "next-common/context/chain";
import normalizeTipListItem from "next-common/utils/viewfuncs/treasury/normalizeTipListItem";

const Popup = dynamic(
  () => import("next-common/components/treasury/tip/popup"),
  {
    ssr: false,
  }
);

export default withLoginUserRedux(({ tips: ssrTips }) => {
  const chain = useChain();
  const [showPopup, setShowPopup] = useState(false);
  const [tips, setTips] = useState(ssrTips);
  useEffect(() => setTips(ssrTips), [ssrTips]);
  const isMounted = useIsMounted();

  const refreshPageData = useCallback(async () => {
    const { result } = await nextApi.fetch("treasury/tips");
    if (result && isMounted.current) {
      setTips(result);
    }
  }, [isMounted]);

  const onNewTipFinalized = useWaitSyncBlock("Tip created", refreshPageData);

  const items = (tips.items || []).map((item) =>
    normalizeTipListItem(chain, item)
  );
  const category = "Tips";
  const seoInfo = { title: "Treasury Tips", desc: "Treasury Tips" };

  const create = (
    <Create onClick={() => setShowPopup(true)}>
      <PlusIcon />
      New Tip
    </Create>
  );

  return (
    <HomeLayout seoInfo={seoInfo}>
      <PostList
        category={category}
        create={create}
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
});

export const getServerSideProps = withLoginUser(async (context) => {
  const { page, page_size: pageSize } = context.query;

  const [{ result: tips }] = await Promise.all([
    ssrNextApi.fetch("treasury/tips", {
      page: page ?? 1,
      pageSize: pageSize ?? 50,
    }),
  ]);

  return {
    props: {
      tips: tips ?? EmptyList,
    },
  };
});
