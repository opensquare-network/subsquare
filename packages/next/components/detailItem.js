import { useState } from "react";
import ArticleContent from "next-common/components/articleContent";
import { EditablePanel } from "next-common/components/styled/panel";
import { detailPageCategory } from "next-common/utils/consts/business/category";
import PostTitle from "next-common/components/detail/common/Title";
import PostMeta from "next-common/components/detail/container/Meta";
import ExternalNavigation from "next-common/components/detail/navigation/external";
import DemocracyProposalNavigation from "next-common/components/detail/navigation/democracyProposal";
import ReferendumNavigation from "next-common/components/detail/navigation/ReferendumNavigation";
import PostEdit from "next-common/components/post/postEdit";
import updatePost from "next-common/utils/viewfuncs/updatePost";
import { usePost, usePostDispatch } from "next-common/context/post";

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
  const postDispatch = usePostDispatch();
  const post = usePost();
  const [isEdit, setIsEdit] = useState(false);
  if (!post) {
    return null;
  }

  if (isEdit) {
    return <PostEdit
      setIsEdit={ setIsEdit }
      updatePost={ () => updatePost(type, post._id, postDispatch) }
      type={ type }
    />
  }

  return (
    <EditablePanel>
      {type === detailPageCategory.DEMOCRACY_EXTERNAL && <ExternalNavigation post={post}/> }
      {
        type === detailPageCategory.DEMOCRACY_PROPOSAL && <DemocracyProposalNavigation
          proposalIndex={ post.proposalIndex }
          referendumIndex={ post?.referendumIndex }
        />
      }
      {type === detailPageCategory.DEMOCRACY_REFERENDUM && <ReferendumNavigation post={post}/>}
      {countDown}
      <PostTitle />
      <PostMeta />
      <ArticleContent
        chain={chain}
        post={post}
        votes={votes}
        myVote={myVote}
        type={type}
        onReply={onReply}
        setIsEdit={setIsEdit}
      />
    </EditablePanel>
  );
}
