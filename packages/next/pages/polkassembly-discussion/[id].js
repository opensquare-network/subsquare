import Back from "next-common/components/back";
import DetailItem from "components/polkassembly/detailItem";
import PolkassemblyComments from "components/polkassembly/comment";
import { withLoginUser, withLoginUserRedux } from "next-common/lib";
import { ssrNextApi as nextApi } from "next-common/services/nextApi";
import Layout from "next-common/components/layout";
import CommentsWrapper from "next-common/components/styled/commentsWrapper";
import { to404 } from "next-common/utils/serverSideUtil";
import { TYPE_PA_POST } from "utils/viewConstants";
import {
  convertPolkassemblyReaction,
  getMetaDesc,
  toPolkassemblyCommentListItem,
} from "utils/viewfuncs";
import DetailPageWrapper from "next-common/components/styled/detailPageWrapper";
import { useEffect, useState } from "react";
import { queryPostComments } from "utils/polkassembly";
import useIsMounted from "next-common/utils/hooks/useIsMounted";

export default withLoginUserRedux(
  ({ loginUser, detail, chain, page, pageSize }) => {
    const isMounted = useIsMounted();
    const [comments, setComments] = useState([]);
    const [postReactions, setPostReactions] = useState([]);
    const [loadingComments, setLoadingComments] = useState(false);

    useEffect(() => {
      if (detail?.polkassemblyId === undefined) {
        return;
      }

      setLoadingComments(true);
      queryPostComments(detail?.polkassemblyId, page, pageSize)
        .then((result) => {
          if (isMounted.current) {
            const comments = result?.comments?.map((item) =>
              toPolkassemblyCommentListItem(chain, item)
            );
            const postReactions = result?.post_reactions?.map((item) =>
              convertPolkassemblyReaction(chain, item)
            );
            setComments(comments);
            setPostReactions(postReactions);
          }
        })
        .finally(() => {
          if (isMounted.current) {
            setLoadingComments(false);
          }
        });
    }, [detail?.polkassemblyId, chain, page, pageSize, isMounted]);

    const desc = getMetaDesc(detail, "Polkassembly Discussions");
    return (
      <Layout
        user={loginUser}
        chain={chain}
        seoInfo={{ title: detail?.title, desc, ogImage: detail?.bannerUrl }}
      >
        <DetailPageWrapper className="post-content">
          <Back
            href={`/polkassembly-discussions`}
            text="Back to Polkassembly Discussions"
          />
          <DetailItem
            data={detail}
            chain={chain}
            postReactions={postReactions}
            type={TYPE_PA_POST}
          />
          <CommentsWrapper>
            <PolkassemblyComments
              isLoading={loadingComments}
              data={{
                items: comments,
                page: page + 1,
                pageSize,
                total: detail.commentsCount,
              }}
              chain={chain}
              type={TYPE_PA_POST}
              paId={detail?.polkassemblyId}
            />
          </CommentsWrapper>
        </DetailPageWrapper>
      </Layout>
    );
  }
);

export const getServerSideProps = withLoginUser(async (context) => {
  const chain = process.env.CHAIN;
  const { id, page } = context.query;
  const [{ result: detail }] = await Promise.all([
    nextApi.fetch(`polkassembly-discussions/${id}`),
  ]);

  if (!detail) {
    return to404(context);
  }

  return {
    props: {
      detail,
      chain,
      page: (page ?? 1) - 1,
      pageSize: 10,
    },
  };
});
