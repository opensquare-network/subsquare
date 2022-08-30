import { useEffect, useState } from "react";
import PostList from "next-common/components/postList";
import { EmptyList } from "next-common/utils/constants";
import { withLoginUser, withLoginUserRedux } from "next-common/lib";
import { ssrNextApi } from "next-common/services/nextApi";
import { toTreasuryProposalListItem } from "utils/viewfuncs";
import Summary from "next-common/components/summary";
import PlusIcon from "public/imgs/icons/plusInCircle.svg";
import dynamic from "next/dynamic";
import Loading from "next-common/components/loading";
import { useDispatch } from "react-redux";
import {
  addPendingProposal,
  setCheckTimes,
} from "next-common/store/reducers/treasuryProposalSlice";
import { Create, Pending } from "next-common/components/treasury/common/styled";
import usePendingProposal from "next-common/components/treasury/proposal/usePendingProposal";
import HomeLayout from "next-common/components/layout/HomeLayout";

const Popup = dynamic(
  () => import("next-common/components/treasury/proposal/popup"),
  {
    ssr: false,
  }
);

export default withLoginUserRedux(
  ({ loginUser, proposals: ssrProposals, chain }) => {
    const dispatch = useDispatch();
    const [showPopup, setShowPopup] = useState(false);
    const [proposals, setProposals] = useState(ssrProposals);

    useEffect(() => {
      setProposals(ssrProposals);
    }, [ssrProposals]);

    const { pendingReload, pendingProposals } = usePendingProposal({
      proposals,
      setProposals,
    });

    const startReload = (_, proposalIndex) => {
      dispatch(addPendingProposal(proposalIndex));
      dispatch(setCheckTimes(6));
    };

    const items = (proposals.items || []).map((item) =>
      toTreasuryProposalListItem(chain, item)
    );

    const create = pendingReload ? (
      <Pending>
        <Loading size={14} />
        <span>{pendingProposals.length} Pending</span>
      </Pending>
    ) : (
      <Create onClick={() => setShowPopup(true)}>
        <PlusIcon />
        New Proposal
      </Create>
    );

    const category = "Treasury Proposals";
    const seoInfo = { title: category, desc: category };

    return (
      <HomeLayout user={loginUser} seoInfo={seoInfo}>
        <PostList
          chain={chain}
          category={category}
          create={create}
          items={items}
          summary={<Summary chain={chain} />}
          pagination={{
            page: proposals.page,
            pageSize: proposals.pageSize,
            total: proposals.total,
          }}
        />
        {showPopup && (
          <Popup
            chain={chain}
            onClose={() => setShowPopup(false)}
            onInBlock={startReload}
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
    ssrNextApi.fetch(`treasury/proposals`, {
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
