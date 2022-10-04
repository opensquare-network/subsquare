import { useState } from "react";
import ArticleContent from "next-common/components/articleContent";
import { EditablePanel } from "next-common/components/styled/panel";
import { detailPageCategory } from "next-common/utils/consts/business/category";
import PostTitle from "next-common/components/detail/common/Title";
import PostMeta from "next-common/components/detail/container/Meta";
import ExternalNavigation from "next-common/components/detail/navigation/external";
import DemocracyProposalNavigation from "next-common/components/detail/navigation/democracyProposal";
import ReferendumNavigation from "next-common/components/detail/navigation/ReferendumNavigation";

export default function DetailItem({
  data,
  user,
  chain,
  onReply,
  type,
  votes,
  myVote,
  countDown = null,
}) {
  const [post, setPost] = useState(data);
  const [isEdit, setIsEdit] = useState(false);
  if (!post) {
    return null;
  }

  return (
    <EditablePanel>
      {!isEdit && (
        <>
          {type === detailPageCategory.DEMOCRACY_EXTERNAL && <ExternalNavigation post={post}/> }
          {
            type === detailPageCategory.DEMOCRACY_PROPOSAL && <DemocracyProposalNavigation
              proposalIndex={ post.proposalIndex }
              referendumIndex={ post?.referendumIndex }
            />
          }
          {type === detailPageCategory.DEMOCRACY_REFERENDUM && <ReferendumNavigation post={post}/>}
          {countDown}
          <PostTitle index={post.index} title={post.title}/>
          <PostMeta post={post} type={type}/>
        </>
      )}
      <ArticleContent
        chain={chain}
        post={post}
        votes={votes}
        myVote={myVote}
        setPost={setPost}
        user={user}
        type={type}
        onReply={onReply}
        isEdit={isEdit}
        setIsEdit={setIsEdit}
      />
    </EditablePanel>
  );
}
