import Back from "next-common/components/back";
import DetailItem from "components/detailItem";
import { withLoginUser, withLoginUserRedux } from "next-common/lib";
import { ssrNextApi as nextApi } from "next-common/services/nextApi";
import { EmptyList } from "next-common/utils/constants";
import { to404 } from "next-common/utils/serverSideUtil";
import getMetaDesc from "next-common/utils/post/getMetaDesc";
import Cookies from "cookies";
import useCommentComponent from "next-common/components/useCommentComponent";
import { detailPageCategory } from "next-common/utils/consts/business/category";
import DetailLayout from "next-common/components/layout/DetailLayout";
import { getBannerUrl } from "next-common/utils/banner";
import { PostProvider } from "next-common/context/post";

export default withLoginUserRedux(
  ({ loginUser, detail, comments, chain, votes, myVote }) => {
    const { CommentComponent, focusEditor } = useCommentComponent({
      detail,
      comments,
      loginUser,
      chain,
      type: detailPageCategory.POST,
    });

    const desc = getMetaDesc(detail);
    return (
      <PostProvider post={detail} type={detailPageCategory.POST}>
        <DetailLayout
          user={loginUser}
          seoInfo={{ title: detail?.title, desc, ogImage: getBannerUrl(detail?.bannerCid) }}
        >
          <Back href={`/discussions`} text="Back to Discussions" />
          <DetailItem
            votes={votes}
            myVote={myVote}
            chain={chain}
            onReply={focusEditor}
            type={detailPageCategory.POST}
          />
          {CommentComponent}
        </DetailLayout>
      </PostProvider>
    );
  }
);

export const getServerSideProps = withLoginUser(async (context) => {
  const chain = process.env.CHAIN;
  const { id, page, page_size: pageSize } = context.query;
  const [{ result: detail }] = await Promise.all([
    nextApi.fetch(`posts/${id}`),
  ]);

  if (!detail) {
    return to404(context);
  }

  const postId = detail._id;

  const { result: comments } = await nextApi.fetch(`posts/${postId}/comments`, {
    page: page ?? "last",
    pageSize: Math.min(pageSize ?? 50, 100),
  });

  let options;
  const cookies = new Cookies(context.req, context.res);
  const authToken = cookies.get("auth-token");
  if (authToken) {
    options = {
      headers: {
        Authorization: `Bearer ${authToken}`,
      },
    };
  }

  let votes = null;
  let myVote = null;
  if (detail.poll) {
    ({ result: votes } = await nextApi.fetch(`polls/${detail.poll._id}/votes`));
    ({ result: myVote } = await nextApi.fetch(
      `polls/${detail.poll._id}/myvote`,
      {},
      options
    ));
  }

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
