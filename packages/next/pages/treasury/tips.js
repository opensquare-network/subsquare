import { useState } from "react";
import { useDispatch } from "react-redux";
import List from "next-common/components/list";
import Menu from "next-common/components/menu";
import { mainMenu } from "next-common/utils/constants";
import { withLoginUser, withLoginUserRedux } from "next-common/lib";
import { ssrNextApi as nextApi } from "next-common/services/nextApi";
import { EmptyList } from "next-common/utils/constants";
import Layout from "next-common/components/layout";
import { toTipListItem } from "utils/viewfuncs";
import Summary from "next-common/components/summary";
import { useEffect } from "react";
import {
  addPendingTip,
  setCheckTimes,
} from "next-common/store/reducers/tipSlice";
import { Create, Pending } from "next-common/components/treasury/common/styled";
import usePendingTip from "next-common/components/treasury/tip/usePendingTip";
import dynamic from "next/dynamic";
import PlusIcon from "public/imgs/icons/plusInCircle.svg";
import Loading from "next-common/components/loading";

const Popup = dynamic(
  () => import("next-common/components/treasury/tip/popup"),
  {
    ssr: false,
  }
);

export default withLoginUserRedux(({ loginUser, tips: ssrTips, chain }) => {
  const dispatch = useDispatch();
  const [showPopup, setShowPopup] = useState(false);
  const [tips, setTips] = useState(ssrTips);

  useEffect(() => {
    setTips(ssrTips);
  }, [ssrTips]);

  const { pendingReload, pendingTips } = usePendingTip({
    tips,
    setTips,
  });

  const startReload = (_, tipHash) => {
    dispatch(addPendingTip(tipHash));
    dispatch(setCheckTimes(6));
  };

  const items = (tips.items || []).map((item) => toTipListItem(chain, item));
  const category = "Tips";
  const seoInfo = { title: `Treasury Tips`, desc: `Treasury Tips` };

  const create = pendingReload ? (
    <Pending>
      <Loading size={14} />
      <span>{pendingTips.length} Pending</span>
    </Pending>
  ) : (
    <Create onClick={() => setShowPopup(true)}>
      <PlusIcon />
      New Tip
    </Create>
  );

  return (
    <Layout
      user={loginUser}
      left={<Menu menu={mainMenu} chain={chain} />}
      chain={chain}
      seoInfo={seoInfo}
    >
      <List
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
          onInBlock={startReload}
        />
      )}
    </Layout>
  );
});

export const getServerSideProps = withLoginUser(async (context) => {
  const chain = process.env.CHAIN;

  const { page, page_size: pageSize } = context.query;

  const [{ result: tips }] = await Promise.all([
    nextApi.fetch(`treasury/tips`, {
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
