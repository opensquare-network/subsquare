import List from "next-common/components/list";
import Menu from "next-common/components/menu";
import { EmptyList, mainMenu } from "next-common/utils/constants";
import { withLoginUser, withLoginUserRedux } from "lib";
import { ssrNextApi as nextApi } from "next-common/services/nextApi";
import Layout from "next-common/components/layout";
import { toTreasuryProposalListItem } from "utils/viewfuncs";
import Summary from "next-common/components/summary";
import PlusIcon from "public/imgs/icons/plusInCircle.svg";
import { useState } from "react";
import dynamic from "next/dynamic";
import Loading from "next-common/components/loading";
import { useDispatch } from "react-redux";
import {
  addPendingProposal,
  setCheckTimes,
} from "next-common/store/reducers/treasuryProposalSlice";
import {
  Create,
  Pending,
} from "next-common/components/treasury/proposal/styled";
import usePendingProposal from "next-common/components/treasury/proposal/usePendingProposal";

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
    const [updatedProposals, setProposals] = useState();
    const proposals = updatedProposals || ssrProposals;

    const { pendingReload, pendingProposals } = usePendingProposal({
      proposals: ssrProposals,
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

    const category = `Treasury Proposals`;
    const seoInfo = { title: category, desc: category };

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
      </Layout>
    );
  }
);

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
