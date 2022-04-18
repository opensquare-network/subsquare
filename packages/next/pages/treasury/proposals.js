import styled from "styled-components";
import List from "next-common/components/list";
import Menu from "next-common/components/menu";
import { mainMenu } from "next-common/utils/constants";
import { withLoginUser, withLoginUserRedux } from "lib";
import nextApi, { ssrNextApi } from "next-common/services/nextApi";
import { EmptyList } from "next-common/utils/constants";
import Layout from "components/layout";
import { toTreasuryProposalListItem } from "utils/viewfuncs";
import Summary from "next-common/components/summary";
import PlusIcon from "public/imgs/icons/plusInCircle.svg";
import { useCallback, useEffect, useState } from "react";
import dynamic from "next/dynamic";
import useIsMounted from "next-common/utils/hooks/useIsMounted";
import Loading from "next-common/components/loading";
import { useDispatch, useSelector } from "react-redux";
import {
  pendingProposalsSelector,
  addPendingProposal,
  removePendingProposal,
  checkTimesSelector,
  setCheckTimes,
} from "next-common/store/reducers/treasuryProposalSlice";

const Popup = dynamic(
  () => import("components/treasuryProposal/popup"),
  {
    ssr: false,
  }
);

const Create = styled.div`
  display: flex;
  align-items: center;
  color: #6848ff;
  font-size: 14px;
  white-space: nowrap;
  svg {
    margin-right: 8px;
  }
  cursor: pointer;
`;

const Pending = styled.div`
  display: flex;
  gap: 8px;
  font-style: normal;
  font-weight: 500;
  font-size: 14px;
  line-height: 100%;
  color: #9da9bb;
`;

export default withLoginUserRedux(
  ({ loginUser, proposals: ssrProposals, chain }) => {
    const dispatch = useDispatch();
    const [showPopup, setShowPopup] = useState(false);
    const [proposals, setProposals] = useState(ssrProposals);
    const isMounted = useIsMounted();
    const pendingProposals = useSelector(pendingProposalsSelector);
    const checkTimes = useSelector(checkTimesSelector);

    const pendingReload = checkTimes > 0 && pendingProposals?.length > 0;

    const startReload = (_, proposalIndex) => {
      dispatch(addPendingProposal(proposalIndex));
      dispatch(setCheckTimes(6));
    };

    const fetchProposals = useCallback(async () => {
      setTimeout(async () => {
        dispatch(setCheckTimes(checkTimes - 1));

        const { result } = await nextApi.fetch(`treasury/proposals`, {
          page: 1,
          pageSize: proposals.pageSize,
        });
        if (result) {
          for (const proposal of result.items) {
            if (pendingProposals.includes(proposal.proposalIndex)) {
              dispatch(removePendingProposal(proposal.proposalIndex));
            }
          }
          if (proposals.page === 1) {
            if (isMounted.current) {
              setProposals(result);
            }
          }
        }
      }, 5000);
    }, [dispatch, checkTimes, pendingProposals, proposals, isMounted]);

    const [reload, setReload] = useState(false);

    useEffect(() => {
      if (!reload) {
        return;
      }
      setReload(false);
      fetchProposals();
    }, [reload, fetchProposals]);

    useEffect(() => {
      if (!pendingReload) {
        return;
      }
      setReload(true);
    }, [pendingReload, checkTimes]);

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
