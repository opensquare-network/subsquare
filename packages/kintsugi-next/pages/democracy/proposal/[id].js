import styled from "styled-components";
import Back from "next-common/components/back";
import DetailItem from "components/detailItem";
import Comments from "next-common/components/comment";
import { withLoginUser, withLoginUserRedux } from "next-common/lib";
import { ssrNextApi as nextApi } from "next-common/services/nextApi";
import { EmptyList } from "next-common/utils/constants";
import Editor from "next-common/components/comment/editor";
import { useRef, useState } from "react";
import Layout from "next-common/components/layout";
import Timeline from "components/publicProposal/timeline";
import Business from "components/publicProposal/business";
import Metadata from "next-common/components/publicProposal/metadata";
import { getFocusEditor, getOnReply } from "next-common/utils/post";
import CommentsWrapper from "next-common/components/styled/commentsWrapper";
import { to404 } from "next-common/utils/serverSideUtil";
import { TYPE_DEMOCRACY_PROPOSAL } from "utils/viewConstants";
import { getMetaDesc } from "utils/viewfuncs";
import OutWrapper from "next-common/components/styled/outWrapper";
import Second from "next-common/components/publicProposal/second";
import { useAddressVotingBalance } from "utils/hooks";
import isNil from "lodash.isnil";
import useMentionList from "next-common/utils/hooks/useMentionList";

const Wrapper = styled.div`
  margin-right: 312px;
  overflow: hidden;
  flex-grow: 1;
  > :not(:first-child) {
    margin-top: 16px;
  }
  @media screen and (max-width: 1024px) {
    max-width: 848px;
    margin: 0 auto;
  }
`;

export default withLoginUserRedux(
  ({ loginUser, detail, referendum, comments, chain }) => {
    const postId = detail._id;

    const editorWrapperRef = useRef(null);
    const [quillRef, setQuillRef] = useState(null);
    const [content, setContent] = useState("");
    const [contentType, setContentType] = useState(
      loginUser?.preference.editor || "markdown"
    );

    const publicProposal = detail?.onchainData;
    const proposalIndex = publicProposal?.proposalIndex;
    const state = publicProposal?.state?.state;
    const isEnded = ["Tabled", "Canceled", "FastTracked", "Cleared"].includes(
      state
    );
    const hasTurnIntoReferendum = !isNil(publicProposal.referendumIndex);
    const hasCanceled = ["Canceled", "Cleared"].includes(state);

    const timeline = publicProposal?.timeline;
    const lastTimelineBlockHeight =
      timeline?.[timeline?.length - 1]?.indexer.blockHeight;
    const secondsAtBlockHeight = isEnded
      ? lastTimelineBlockHeight - 1
      : undefined;

    const users = useMentionList(detail, comments, chain);

    const focusEditor = getFocusEditor(contentType, editorWrapperRef, quillRef);

    const onReply = getOnReply(
      contentType,
      content,
      setContent,
      quillRef,
      focusEditor,
      chain
    );

    const referendumIndex = detail?.referendumIndex;

    detail.status = detail.onchainData?.state?.state;

    const desc = getMetaDesc(detail, "Proposal");
    return (
      <Layout
        user={loginUser}
        chain={chain}
        seoInfo={{ title: detail?.title, desc, ogImage: detail?.bannerUrl }}
      >
        <OutWrapper>
          <Wrapper className="post-content">
            <Back href={`/democracy/proposals`} text="Back to Proposals" />
            <DetailItem
              data={detail}
              user={loginUser}
              chain={chain}
              onReply={focusEditor}
              type={TYPE_DEMOCRACY_PROPOSAL}
            />
            <Second
              chain={chain}
              proposalIndex={proposalIndex}
              hasTurnIntoReferendum={hasTurnIntoReferendum}
              hasCanceled={hasCanceled}
              useAddressVotingBalance={useAddressVotingBalance}
              atBlockHeight={secondsAtBlockHeight}
            />
            <Business referendumIndex={referendumIndex} />
            <Metadata publicProposal={detail?.onchainData} chain={chain} />
            <Timeline
              publicProposalTimeline={detail?.onchainData?.timeline}
              referendumTimeline={referendum?.onchainData?.timeline}
              chain={chain}
            />
            <CommentsWrapper>
              <Comments
                data={comments}
                user={loginUser}
                chain={chain}
                onReply={onReply}
              />
              {loginUser && (
                <Editor
                  postId={postId}
                  chain={chain}
                  ref={editorWrapperRef}
                  setQuillRef={setQuillRef}
                  {...{
                    contentType,
                    setContentType,
                    content,
                    setContent,
                    users,
                  }}
                  type={TYPE_DEMOCRACY_PROPOSAL}
                />
              )}
            </CommentsWrapper>
          </Wrapper>
        </OutWrapper>
      </Layout>
    );
  }
);

export const getServerSideProps = withLoginUser(async (context) => {
  const chain = process.env.CHAIN;
  const { id, page, page_size: pageSize } = context.query;

  const [{ result: detail }] = await Promise.all([
    nextApi.fetch(`democracy/proposals/${id}`),
  ]);

  if (!detail) {
    return to404(context);
  }

  let referendum = null;
  if ((detail.referendumIndex ?? null) !== null) {
    const result = await nextApi.fetch(
      `democracy/referendums/${detail.referendumIndex}`
    );
    referendum = result.result;
  }

  const { result: comments } = await nextApi.fetch(
    `democracy/proposals/${detail._id}/comments`,
    {
      page: page ?? "last",
      pageSize: Math.min(pageSize ?? 50, 100),
    }
  );

  return {
    props: {
      detail,
      referendum,
      comments: comments ?? EmptyList,
      chain,
    },
  };
});
