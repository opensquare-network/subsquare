import { withLoginUser } from "next-common/lib";
import { ssrNextApi as nextApi } from "next-common/services/nextApi";
import TechcommMotionDetail from "components/motion/techcommMotionDetail";
import getMetaDesc from "next-common/utils/post/getMetaDesc";
import { EmptyList } from "next-common/utils/constants";
import useCommentComponent from "next-common/components/useCommentComponent";
import DetailLayout from "next-common/components/layout/DetailLayout";
import { getBannerUrl } from "next-common/utils/banner";
import { PostProvider } from "next-common/context/post";
import CheckUnFinalized from "next-common/components/motion/checkUnFinalized";
import NonNullPost from "next-common/components/nonNullPost";
import useSubscribePostDetail from "next-common/hooks/useSubscribePostDetail";
import { fetchDetailComments } from "next-common/services/detail";
import { getNullDetailProps } from "next-common/services/detail/nullDetail";

function TechCommMotionContent({ motion, comments }) {
  const { CommentComponent, focusEditor } = useCommentComponent({
    detail: motion,
    comments,
  });

  useSubscribePostDetail(`${motion?.height}_${motion?.hash}`);

  return (
    <>
      <TechcommMotionDetail motion={motion} onReply={focusEditor} />
      {CommentComponent}
    </>
  );
}

export default function Proposal({ id, motion, comments }) {
  let postContent = null;

  if (motion) {
    postContent = (
      <NonNullPost>
        <TechCommMotionContent motion={motion} comments={comments} />
      </NonNullPost>
    );
  } else {
    postContent = <CheckUnFinalized id={id} />;
  }

  const desc = getMetaDesc(motion);
  return (
    <PostProvider post={motion}>
      <DetailLayout
        detail={motion}
        seoInfo={{
          title: motion?.title,
          desc,
          ogImage: getBannerUrl(motion?.bannerCid),
        }}
      >
        {postContent}
      </DetailLayout>
    </PostProvider>
  );
}

export const getServerSideProps = withLoginUser(async (context) => {
  const { id } = context.query;

  const { result: motion } = await nextApi.fetch(`tech-comm/motions/${id}`);

  if (!motion) {
    return getNullDetailProps(id, { motion: null });
  }

  const comments = await fetchDetailComments(
    `tech-comm/motions/${motion._id}/comments`,
    context,
  );

  return {
    props: {
      id,
      motion: motion ?? null,
      comments: comments ?? EmptyList,
    },
  };
});
