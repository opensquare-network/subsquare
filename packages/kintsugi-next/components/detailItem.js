import MaybeSimaDiscussionArticleContent from "next-common/components/maybeSimaDiscussionArticleContent";
import PostEdit from "next-common/components/post/postEdit";
import { usePost, usePostDispatch } from "next-common/context/post";
import fetchAndUpdatePost from "next-common/context/post/update";
import { useDetailType } from "next-common/context/page";
import DetailContentBase from "next-common/components/detail/common/detailBase";
import useSetEdit from "next-common/components/detail/common/hooks/useSetEdit";
import { useSelector } from "react-redux";
import { isEditingPostSelector } from "next-common/store/reducers/userSlice";
import DetailHeader from "./detailHeader";

export default function DetailItem() {
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
      <MaybeSimaDiscussionArticleContent />
    </DetailContentBase>
  );
}
