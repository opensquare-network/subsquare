import MotionSideBar from "./vote";
import DetailContentBase from "next-common/components/detail/common/detailBase";
import PostEdit from "next-common/components/post/postEdit";
import { usePost, usePostDispatch } from "next-common/context/post";
import fetchAndUpdatePost from "next-common/context/post/update";
import { useDetailType } from "next-common/context/page";
import useSubscribePostDetail from "next-common/hooks/useSubscribePostDetail";
import useSetEdit from "next-common/components/detail/common/hooks/useSetEdit";
import { useSelector } from "react-redux";
import { isEditingPostSelector } from "next-common/store/reducers/userSlice";
import MotionHead from "./head";
import MaybeSimaDiscussionArticleContent from "next-common/components/maybeSimaDiscussionArticleContent";
import MotionDetailMultiTabs from "components/tabs/motionDetailMultiTabs";

export default function CommonMotionDetail({ head }) {
  const type = useDetailType();
  const postDispatch = usePostDispatch();
  const post = usePost();

  useSubscribePostDetail(`${post?.height}_${post?.hash}`);

  const isEdit = useSelector(isEditingPostSelector);
  const setIsEdit = useSetEdit();

  const refreshPageData = () =>
    fetchAndUpdatePost(postDispatch, type, post._id);

  if (isEdit) {
    return <PostEdit setIsEdit={setIsEdit} updatePost={refreshPageData} />;
  }

  return (
    <>
      <DetailContentBase head={head}>
        {!isEdit && <MotionHead motion={post} type={type} />}
        <MaybeSimaDiscussionArticleContent />
      </DetailContentBase>
      <MotionSideBar motionHash={post.hash} motionIndex={post.motionIndex} />
      <MotionDetailMultiTabs />
    </>
  );
}
