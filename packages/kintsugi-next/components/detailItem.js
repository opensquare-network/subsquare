import { useState } from "react";
import ArticleContent from "next-common/components/articleContent";
import { EditablePanel } from "next-common/components/styled/panel";
import { detailPageCategory } from "next-common/utils/consts/business/category";
import PostTitle from "next-common/components/detail/common/Title";
import { KintsugiDemocracyProposalNavigation } from "next-common/components/detail/navigation/democracyProposal";
import { KintsugiReferendumNavigation } from "next-common/components/detail/navigation/ReferendumNavigation";
import PostMeta from "next-common/components/detail/container/Meta";

export default function DetailItem({
  data,
  user,
  chain,
  onReply,
  votes,
  myVote,
  type,
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
          {type === detailPageCategory.DEMOCRACY_PROPOSAL && <KintsugiDemocracyProposalNavigation post={post}/>}
          { type === detailPageCategory.DEMOCRACY_REFERENDUM && <KintsugiReferendumNavigation post={ post } /> }
          <PostTitle index={post.index} title={post.title}/>
          <PostMeta post={post} type={type}/>
        </>
      )}
      <ArticleContent
        chain={chain}
        post={post}
        setPost={setPost}
        user={user}
        type={type}
        onReply={onReply}
        isEdit={isEdit}
        setIsEdit={setIsEdit}
        votes={votes}
        myVote={myVote}
      />
    </EditablePanel>
  );
}
