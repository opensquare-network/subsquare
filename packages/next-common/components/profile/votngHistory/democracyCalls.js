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
import Link from "next/link";
import { normalizeCall } from "./common";
import { DemocracyReferendumTag } from "next-common/components/tags/state/democracy";
import ExplorerLink from "next-common/components/links/explorerLink";
import dayjs from "dayjs";
import { getDemocracyStateArgs } from "next-common/utils/democracy/result";

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

export default function DemocracyCalls() {
  const { id } = usePageProps();
  const [data, setData] = useState(EmptyList);

  const { columns } = useColumns([
    { name: "Proposals", style: { textAlign: "left", minWidth: "180px" } },
    { name: "Date", style: { textAlign: "left", minWidth: "200px" } },
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
        .fetch(`users/${id}/democracy/vote-calls`, {
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
        <Link href={`/democracy/referendum/${item.referendumIndex}`}>
          {item.proposal?.title}
        </Link>
      </Flex>,
      <div key="date" className="text-textTertiary whitespace-nowrap">
        <ExplorerLink indexer={item.indexer}>
          {dayjs(item.indexer.blockTime).format("YYYY-MM-DD hh:mm:ss")}
        </ExplorerLink>
      </div>,
      <VoteItem key="vote" vote={normalizeCall(item)} />,
      <DemocracyReferendumTag
        key="status"
        state={item.proposal?.state?.state}
        args={getDemocracyStateArgs(
          item.proposal?.state,
          item.proposal?.timeline,
        )}
      />,
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
