import ArticleContent from "next-common/components/articleContent";
import PostEdit from "next-common/components/post/postEdit";
import { usePost, usePostDispatch } from "next-common/context/post";
import fetchAndUpdatePost from "next-common/context/post/update";
import { useDetailType } from "next-common/context/page";
import DetailContentBase from "next-common/components/detail/common/detailBase";
import useSetEdit from "next-common/components/detail/common/hooks/useSetEdit";
import { useSelector } from "react-redux";
import { isEditingPostSelector } from "next-common/store/reducers/userSlice";
import DetailHeader from "./detailHeader";

export default function DetailItem({ votes, myVote }) {
  const type = useDetailType();
  const postDispatch = usePostDispatch();
  const post = usePost();
  const isEdit = useSelector(isEditingPostSelector);
  const setIsEdit = useSetEdit();

  if (isEdit) {
    return (
      <PostEdit
        setIsEdit={setIsEdit}
        updatePost={() => fetchAndUpdatePost(postDispatch, type, post._id)}
      />
    );
  }

  return (
    <DetailContentBase>
      <DetailHeader />
      <ArticleContent
        className="mt-6"
        post={post}
        setIsEdit={setIsEdit}
        votes={votes}
        myVote={myVote}
      />
    </DetailContentBase>
  );
}
