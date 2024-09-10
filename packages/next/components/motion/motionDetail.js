import ArticleContent from "next-common/components/articleContent";
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
import DetailMultiTabs from "next-common/components/detail/detailMultiTabs";
import { useCouncilMotionBusinessData } from "next-common/hooks/useCouncilMotionBusinessData";
import dynamicClientOnly from "next-common/lib/dynamic/clientOnly";

const Business = dynamicClientOnly(() => import("./business"));

const Metadata = dynamicClientOnly(() => import("./metadata"));

const Timeline = dynamicClientOnly(() => import("./timeline"));

const CollectiveCall = dynamicClientOnly(() =>
  import("next-common/components/collective/call"),
);

export default function MotionDetail() {
  const type = useDetailType();
  const postDispatch = usePostDispatch();
  const post = usePost();
  const motionBusinessData = useCouncilMotionBusinessData();

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
      <DetailContentBase>
        {!isEdit && <MotionHead motion={post} type={type} />}
        <ArticleContent className="mt-6" setIsEdit={setIsEdit} />
      </DetailContentBase>
      <MotionSideBar
        motionHash={post.hash}
        motionIndex={post.motionIndex}
      />
      <DetailMultiTabs
        call={
          post?.onchainData?.proposal && (
            <CollectiveCall call={post.onchainData.proposal} />
          )
        }
        business={
          !!motionBusinessData?.length && (
            <Business motion={post?.onchainData} />
          )
        }
        metadata={<Metadata />}
        timeline={<Timeline />}
      />
    </>
  );
}
