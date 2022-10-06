import { useState } from "react";
import ArticleContent from "next-common/components/articleContent";
import { EditablePanel } from "next-common/components/styled/panel";
import { detailPageCategory } from "next-common/utils/consts/business/category";
import PostTitle from "next-common/components/detail/common/Title";
import { KintsugiDemocracyProposalNavigation } from "next-common/components/detail/navigation/democracyProposal";
import { KintsugiReferendumNavigation } from "next-common/components/detail/navigation/ReferendumNavigation";
import PostMeta from "next-common/components/detail/container/Meta";
import PostEdit from "next-common/components/post/postEdit";
import updatePost from "next-common/utils/viewfuncs/updatePost";

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

  if (isEdit) {
    return <PostEdit
      postData={ post }
      setIsEdit={ setIsEdit }
      updatePost={ () => updatePost(type, post._id, setPost) }
      type={ type }
    />
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
        setIsEdit={setIsEdit}
        votes={votes}
        myVote={myVote}
      />
    </EditablePanel>
  );
}
