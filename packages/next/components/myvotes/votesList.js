import styled from "styled-components";
import { pretty_scroll_bar } from "next-common/styles/componentCss";
import StyledListOrigin from "next-common/components/styledList";
import useColumns from "next-common/components/styledList/useColumns";
import {
  PostTitle,
  ReferendumTag,
  VoteItem,
} from "next-common/components/profile/votingHistory/common";
import { useEffect, useState } from "react";
import nextApi from "next-common/services/nextApi";
import pick from "lodash.pick";
import FieldLoading from "next-common/components/icons/fieldLoading";

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

function normalizeVote(vote) {
  if (vote.isStandard) {
    const { balance, vote: _vote } = vote.asStandard;
    return {
      isStandard: true,
      balance: balance.toNumber(),
      conviction: _vote.conviction.toNumber(),
      aye: _vote.isAye,
    };
  } else if (vote.isSplit) {
    const { aye, nay } = vote.asSplit;
    return {
      isSplit: true,
      ayeBalance: aye.toNumber(),
      nayBalance: nay.toNumber(),
    };
  } else if (vote.isSplitAbstain) {
    const { aye, nay, abstain } = vote.asSplitAbstain;
    return {
      isSplitAbstain: true,
      ayeBalance: aye.toNumber(),
      nayBalance: nay.toNumber(),
      abstainBalance: abstain.toNumber(),
    };
  }

  return {};
}

export default function VotesList({ votes, isGov2 }) {
  const columnsDefinition = [
    {
      name: "Proposal",
      style: { textAlign: "left", minWidth: "230px", maxWidth: 600 },
    },
    {
      name: "Vote for",
      style: { textAlign: "left", width: "128px", minWidth: "128px" },
    },
    {
      name: "Status",
      style: { textAlign: "right", width: "128px", minWidth: "128px" },
    },
  ];

  const { columns } = useColumns(columnsDefinition);

  const rows = (votes || []).map((item) => {
    return {
      useData: () => {
        const [referendumPost, setReferendumPost] = useState();

        useEffect(() => {
          nextApi
            .fetch(`gov2/referendums/${item.referendumIndex}`)
            .then(({ result }) => {
              if (result) {
                setReferendumPost(pick(result || {}, ["title", "onchainData"]));
              }
            });
        }, []);

        const vote = normalizeVote(item.vote);

        return [
          referendumPost ? (
            <PostTitle
              key="proposal"
              referendumIndex={item.referendumIndex}
              title={referendumPost.title}
              isGov2={isGov2}
            />
          ) : (
            <FieldLoading />
          ),
          <VoteItem key="vote" vote={vote} />,
          referendumPost ? (
            <ReferendumTag
              key="tag"
              proposal={referendumPost.onchainData}
              isGov2={isGov2}
            />
          ) : (
            <FieldLoading />
          ),
        ];
      },
    };
  });

  return (
    <ListWrapper>
      <StyledList loading={!votes} columns={columns} rows={rows} />
    </ListWrapper>
  );
}
