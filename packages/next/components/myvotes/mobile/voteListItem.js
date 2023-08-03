import { ListCard } from "../styled";
import {
  PostTitle,
  ReferendumTag,
  VoteItem,
} from "next-common/components/profile/votingHistory/common";
import { normalizeVote } from "../common";
import { useEffect, useState } from "react";
import nextApi from "next-common/services/nextApi";
import pick from "lodash.pick";
import FieldLoading from "next-common/components/icons/fieldLoading";

function ItemHeader({ vote, isGov2 }) {
  const [referendumPost, setReferendumPost] = useState();

  useEffect(() => {
    let url = `democracy/referendums/${vote.referendumIndex}`;
    if (isGov2) {
      url = `gov2/referendums/${vote.referendumIndex}`;
    }
    nextApi.fetch(url).then(({ result }) => {
      if (result) {
        setReferendumPost(pick(result || {}, ["title", "onchainData"]));
      }
    });
  }, [vote.referendumIndex, isGov2]);

  return (
    <div>
      <div className="flex justify-between pb-[12px] border-b border-b-neutral-300">
        {referendumPost ? (
          <PostTitle
            referendumIndex={vote.referendumIndex}
            title={referendumPost?.title}
            isGov2={isGov2}
          />
        ) : (
          <FieldLoading />
        )}
      </div>
      <div className="flex justify-end pt-[12px] items-center">
        {referendumPost ? (
          <ReferendumTag
            proposal={referendumPost?.onchainData}
            isGov2={isGov2}
          />
        ) : (
          <FieldLoading />
        )}
      </div>
    </div>
  );
}

export default function VoteListItem({ vote, isGov2 }) {
  const normalizedVote = normalizeVote(vote.vote);
  return (
    <ListCard>
      <ItemHeader vote={vote} isGov2={isGov2} />
      <div className="mt-[24px]">
        <VoteItem vote={normalizedVote} />
      </div>
    </ListCard>
  );
}
