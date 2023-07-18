import { pretty_scroll_bar } from "next-common/styles/componentCss";
import styled from "styled-components";
import StyledListOrigin from "next-common/components/styledList";
import useColumns from "next-common/components/styledList/useColumns";
import Pagination from "next-common/components/pagination";
import { useCallback, useEffect, useState } from "react";
import nextApi from "next-common/services/nextApi";
import { usePageProps } from "next-common/context/page";
import Flex from "next-common/components/styled/flex";
import { EmptyList } from "next-common/utils/constants";
import VoteItem from "./voteItem";
import { Gov2ReferendaTag } from "next-common/components/tags/state/gov2";
import Link from "next/link";
import BigNumber from "bignumber.js";
import { convictionToLockXNumber } from "next-common/utils/referendumCommon";
import ExplorerLink from "next-common/components/links/explorerLink";
import dayjs from "dayjs";

const ListWrapper = styled.div`
  display: flex;
  overflow-x: auto;
  ${pretty_scroll_bar};
`;

const StyledList = styled(StyledListOrigin)`
  border: none;
  box-shadow: none;
  padding: 0;
`;

function normalizeCall(vote) {
  if (vote.isStandard) {
    const {
      balance,
      vote: { isAye, conviction },
    } = vote.vote;
    return {
      ...vote,
      balance,
      conviction,
      aye: isAye,
      votes: new BigNumber(balance)
        .times(convictionToLockXNumber(conviction))
        .toFixed(),
    };
  }

  if (vote.isSplit) {
    const { aye, nay } = vote.vote;
    return {
      ...vote,
      aye,
      nay,
      ayeVotes: new BigNumber(aye).times(0.1).toFixed(),
      nayVotes: new BigNumber(nay).times(0.1).toFixed(),
    };
  }

  if (vote.isSplitAbstain) {
    const { aye, nay, abstain } = vote.vote;
    return {
      ...vote,
      aye,
      nay,
      abstain,
      ayeVotes: new BigNumber(aye).times(0.1).toFixed(),
      nayVotes: new BigNumber(nay).times(0.1).toFixed(),
      abstainVotes: new BigNumber(abstain).times(0.1).toFixed(),
    };
  }

  return vote;
}

export default function OpenGovCalls() {
  const { id } = usePageProps();
  const [data, setData] = useState(EmptyList);

  const { columns } = useColumns([
    { name: "Proposals", style: { textAlign: "left", minWidth: "230px" } },
    { name: "Date", style: { textAlign: "left", minWidth: "128px" } },
    {
      name: "Vote",
      style: { textAlign: "left", width: "128px", minWidth: "128px" },
    },
    {
      name: "Status",
      style: { textAlign: "right", width: "128px", minWidth: "128px" },
    },
  ]);

  const fetchData = useCallback(
    (page, pageSize) => {
      nextApi
        .fetch(`users/${id}/referenda/vote-calls`, {
          page,
          pageSize,
          includesTitle: 1,
        })
        .then(({ result }) => {
          if (result) {
            setData(result);
          }
        });
    },
    [id],
  );

  useEffect(() => {
    fetchData(data?.page, data?.pageSize);
  }, [fetchData, data?.page, data?.pageSize]);

  const rows = (data?.items || []).map((item) => {
    const row = [
      <Flex key="proposal">
        <Link href={`/referenda/referendum/${item.referendumIndex}`}>
          {item.proposal?.title}
        </Link>
      </Flex>,
      <div key="date" className="text-textTertiary">
        <ExplorerLink indexer={item.indexer}>
          {dayjs(item.indexer.blockTime).format("YYYY-MM-DD hh:mm:ss")}
        </ExplorerLink>
      </div>,
      <VoteItem key="vote" vote={normalizeCall(item)} />,
      <Gov2ReferendaTag key="status" state={item.proposal?.state?.name} />,
    ];

    return row;
  });

  return (
    <>
      <ListWrapper>
        <StyledList columns={columns} rows={rows} />
      </ListWrapper>
      <Pagination
        {...data}
        onPageChange={(e, page) => {
          e.stopPropagation();
          e.preventDefault();
          fetchData(page, data?.pageSize);
        }}
      />
    </>
  );
}
