import { useState } from "react";
import ArticleContent from "next-common/components/articleContent";
import { EditablePanel } from "next-common/components/styled/panel";
import { detailPageCategory } from "next-common/utils/consts/business/category";
import PostTitle from "next-common/components/detail/common/Title";
import { KintsugiDemocracyProposalNavigation } from "next-common/components/detail/navigation/democracyProposal";
import { KintsugiReferendumNavigation } from "next-common/components/detail/navigation/ReferendumNavigation";
import PostMeta from "next-common/components/detail/container/Meta";
import PostEdit from "next-common/components/post/postEdit";
import { fetchPost } from "next-common/store/reducers/postSlice";

export default function DetailItem({
  data,
  user,
  chain,
  onReply,
  votes,
  myVote,
  type,
}) {
  const [post] = useState(data);
  const [isEdit, setIsEdit] = useState(false);
  if (!post) {
    return null;
  }

  if (isEdit) {
    return <PostEdit
      setIsEdit={ setIsEdit }
      updatePost={ () => dispatch(fetchPost(type, post._id)) }
      type={ type }
    />
  }

  return (
    <EditablePanel>
      {type === detailPageCategory.DEMOCRACY_PROPOSAL && <KintsugiDemocracyProposalNavigation post={post}/>}
      { type === detailPageCategory.DEMOCRACY_REFERENDUM && <KintsugiReferendumNavigation post={ post } /> }
      <PostTitle />
      <PostMeta />
      <ArticleContent
        chain={chain}
        post={post}
        type={type}
        onReply={onReply}
        setIsEdit={setIsEdit}
        votes={votes}
        myVote={myVote}
      />
    </EditablePanel>
  );
}
