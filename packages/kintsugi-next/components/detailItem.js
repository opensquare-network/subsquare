import { useState } from "react";
import ArticleContent from "next-common/components/articleContent";
import { EditablePanel } from "next-common/components/styled/panel";
import { detailPageCategory } from "next-common/utils/consts/business/category";
import PostTitle from "next-common/components/detail/common/Title";
import { KintsugiDemocracyProposalNavigation } from "next-common/components/detail/navigation/democracyProposal";
import { KintsugiReferendumNavigation } from "next-common/components/detail/navigation/ReferendumNavigation";
import PostMeta from "next-common/components/detail/container/Meta";
import PostEdit from "next-common/components/post/postEdit";
import { usePost, usePostDispatch } from "next-common/context/post";
import fetchAndUpdatePost from "next-common/context/post/update";
import { useDetailType } from "next-common/context/page";
import MaliciousHead from "next-common/components/detail/maliciousHead";
import ReferendumVoteEndCountDown from "next-common/components/democracy/referendum/voteEndCountDown";

export default function DetailItem({ onReply, votes, myVote }) {
  const type = useDetailType();
  const postDispatch = usePostDispatch();
  const post = usePost();
  const [isEdit, setIsEdit] = useState(false);

  if (isEdit) {
    return (
      <PostEdit
        setIsEdit={setIsEdit}
        updatePost={() => fetchAndUpdatePost(postDispatch, type, post._id)}
      />
    );
  }

  return (
    <EditablePanel>
      {post?.isMalicious && <MaliciousHead />}
      {
        type === detailPageCategory.DEMOCRACY_REFERENDUM && <ReferendumVoteEndCountDown />
      }
      {type === detailPageCategory.DEMOCRACY_PROPOSAL && (
        <KintsugiDemocracyProposalNavigation post={post} />
      )}
      {type === detailPageCategory.DEMOCRACY_REFERENDUM && (
        <KintsugiReferendumNavigation post={post} />
      )}
      <PostTitle />
      <PostMeta />
      <ArticleContent
        post={post}
        onReply={onReply}
        setIsEdit={setIsEdit}
        votes={votes}
        myVote={myVote}
      />
    </EditablePanel>
  );
}
