import Back from "next-common/components/back";
import DetailItem from "components/detailItem";
import PolkassemblyComments from "next-common/components/comment";
import { withLoginUser, withLoginUserRedux } from "next-common/lib";
import { ssrNextApi as nextApi } from "next-common/services/nextApi";
import Layout from "next-common/components/layout";
import CommentsWrapper from "next-common/components/styled/commentsWrapper";
import { to404 } from "next-common/utils/serverSideUtil";
import { TYPE_PA_POST } from "utils/viewConstants";
import { getMetaDesc } from "utils/viewfuncs";
import DetailPageWrapper from "next-common/components/styled/detailPageWrapper";
import { emptyFunction } from "next-common/utils";
import { useEffect, useState } from "react";
import { queryPostComments } from "utils/polkassembly";
import useIsMounted from "next-common/utils/hooks/useIsMounted";

export default withLoginUserRedux(
  ({ loginUser, detail, chain }) => {
    const isMounted = useIsMounted();
    const [comments, setComments] = useState([]);
    const [loadingComments, setLoadingComments] = useState(false);

    useEffect(() => {
      if (detail?.polkassemblyId === undefined) {
        return;
      }

      setLoadingComments(true);
      queryPostComments(detail?.polkassemblyId)
        .then((comments) => {
          if (isMounted.current) {
            setComments(comments);
          }
        })
        .finally(() => {
          if (isMounted.current) {
            setLoadingComments(false);
          }
        });
    }, [detail.polkassemblyId, isMounted]);

    const desc = getMetaDesc(detail, "Polkassembly Discussions");
    return (
      <Layout
        user={loginUser}
        chain={chain}
        seoInfo={{ title: detail?.title, desc, ogImage: detail?.bannerUrl }}
      >
        <DetailPageWrapper className="post-content">
          <Back href={`/polkassembly-discussions`} text="Back to Polkassembly Discussions" />
          <DetailItem
            data={{ ...detail, contentType: "markdown" }}
            user={loginUser}
            chain={chain}
            onReply={emptyFunction}
            type={TYPE_PA_POST}
          />
          <CommentsWrapper>
            <PolkassemblyComments
              isLoading={loadingComments}
              data={comments}
              user={loginUser}
              chain={chain}
              onReply={emptyFunction}
            />
          </CommentsWrapper>
        </DetailPageWrapper>
      </Layout>
    );
  }
);

export const getServerSideProps = withLoginUser(async (context) => {
  const chain = process.env.CHAIN;
  const { id } = context.query;
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
    },
  };
});
