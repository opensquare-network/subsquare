import { withLoginUser, withLoginUserRedux } from "next-common/lib";
import { ssrNextApi as nextApi } from "next-common/services/nextApi";
import TechcommMotionDetail from "components/motion/techcommMotionDetail";
import getMetaDesc from "next-common/utils/post/getMetaDesc";
import { EmptyList } from "next-common/utils/constants";
import useCommentComponent from "next-common/components/useCommentComponent";
import DetailLayout from "next-common/components/layout/DetailLayout";
import { getBannerUrl } from "next-common/utils/banner";
import { PostProvider } from "next-common/context/post";
import { hashEllipsis } from "next-common/utils";
import CheckUnFinalized from "next-common/components/motion/checkUnFinalized";
import NonNullPost from "next-common/components/nonNullPost";
import useSubscribePostDetail from "next-common/hooks/useSubscribePostDetail";
import { fetchDetailComments } from "next-common/services/detail";

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

export default withLoginUserRedux(({ id, motion, comments }) => {
  let breadcrumbItemName = "";
  let postContent = null;

  if (motion) {
    breadcrumbItemName = `#${
      motion?.motionIndex ?? hashEllipsis(motion?.hash)
    }`;
    postContent = (
      <NonNullPost>
        <TechCommMotionContent motion={motion} comments={comments} />
      </NonNullPost>
    );
  } else {
    if (id?.match(/^[0-9]+$/)) {
      breadcrumbItemName = `#${id}`;
    } else {
      const hash = id?.split("_").pop();
      breadcrumbItemName = `#${hashEllipsis(hash)}`;
    }
    postContent = <CheckUnFinalized id={id} />;
  }

  const desc = getMetaDesc(motion);

  const breadcrumbItems = [
    {
      content: "Tech.Comm.",
    },
    {
      content: "Proposals",
      path: "/techcomm/proposals",
    },
    {
      content: breadcrumbItemName,
    },
  ];

  return (
    <PostProvider post={motion}>
      <DetailLayout
        detail={motion}
        seoInfo={{
          title: motion?.title,
          desc,
          ogImage: getBannerUrl(motion?.bannerCid),
        }}
        breadcrumbs={breadcrumbItems}
      >
        {postContent}
      </DetailLayout>
    </PostProvider>
  );
});

export const getServerSideProps = withLoginUser(async (context) => {
  const { id, page, page_size: pageSize } = context.query;

  const { result: motion } = await nextApi.fetch(`tech-comm/motions/${id}`);

  if (!motion) {
    return {
      props: {
        id,
        motion: null,
        comments: EmptyList,
      },
    };
  }

  const comments = await fetchDetailComments(
    `tech-comm/motions/${motion._id}/comments`,
    page,
    pageSize,
  );

  return {
    props: {
      id,
      motion: motion ?? null,
      comments: comments ?? EmptyList,
    },
  };
});
