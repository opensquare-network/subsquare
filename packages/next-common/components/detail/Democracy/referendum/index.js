import React from "react";
import { usePost } from "next-common/context/post";
import useSetEdit from "next-common/components/detail/common/hooks/useSetEdit";
import DetailContentBase from "next-common/components/detail/common/detailBase";
import ReferendumNavigation from "next-common/components/detail/navigation/ReferendumNavigation";
import ReferendumVoteEndCountDown from "next-common/components/democracy/referendum/voteEndCountDown";
import PostTitle from "next-common/components/detail/common/Title";
import DemocracyReferendumMeta from "next-common/components/detail/Democracy/referendum/meta";
import ArticleContent from "next-common/components/articleContent";
import ExecutionCountdown from "next-common/components/detail/Democracy/referendum/executionCountdown";

export default function DemocracyReferendaDetail({ onReply }) {
  const post = usePost();
  const setIsEdit = useSetEdit();

  return <DetailContentBase>
    <ExecutionCountdown />
    <ReferendumVoteEndCountDown />
    <ReferendumNavigation post={post} />
    <PostTitle />
    <DemocracyReferendumMeta />
    <ArticleContent
      post={post}
      onReply={onReply}
      setIsEdit={setIsEdit}
    />
  </DetailContentBase>
}
