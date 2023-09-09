import DetailItem from "components/detailItem";
import { withLoginUser, withLoginUserRedux } from "next-common/lib";
import { ssrNextApi as nextApi } from "next-common/services/nextApi";
import { EmptyList } from "next-common/utils/constants";
import { to404 } from "next-common/utils/serverSideUtil";
import getMetaDesc from "next-common/utils/post/getMetaDesc";
import useCommentComponent from "next-common/components/useCommentComponent";
import DetailLayout from "next-common/components/layout/DetailLayout";
import { getBannerUrl } from "next-common/utils/banner";
import { PostProvider } from "next-common/context/post";
import {
  fetchDetailComments,
  getPostVotesAndMine,
} from "next-common/services/detail";

export default withLoginUserRedux(({ detail, comments, votes, myVote }) => {
  const { CommentComponent, focusEditor } = useCommentComponent({
    detail,
    comments,
  });

  const breadcrumbItems = [
    {
      content: "Discussions",
      path: "/discussions",
    },
    {
      content: "#" + detail?.postUid,
    },
  ];

  const desc = getMetaDesc(detail);
  return (
    <PostProvider post={detail}>
      <DetailLayout
        seoInfo={{
          title: detail?.title,
          desc,
          ogImage: getBannerUrl(detail?.bannerCid),
        }}
        breadcrumbs={breadcrumbItems}
      >
        <DetailItem votes={votes} myVote={myVote} onReply={focusEditor} />
        {CommentComponent}
      </DetailLayout>
    </PostProvider>
  );
});

export const getServerSideProps = withLoginUser(async (context) => {
  const chain = process.env.CHAIN;
  const { id, page, page_size: pageSize } = context.query;
  const [{ result: detail }] = await Promise.all([
    nextApi.fetch(`posts/${id}`),
  ]);

  if (!detail) {
    return to404();
  }

  const comments = await fetchDetailComments(
    `posts/${detail._id}/comments`,
    page,
    pageSize,
  );
  const { votes, myVote } = await getPostVotesAndMine(detail, context);

  return {
    props: {
      detail,
      comments: comments ?? EmptyList,
      votes,
      myVote: myVote ?? null,
      chain,
    },
  };
});
