/* eslint-disable react/jsx-key */
import styled from "styled-components";
import Back from "next-common/components/back";
import DetailItem from "components/detailItem";
import Comments from "next-common/components/comment";
import { withLoginUser, withLoginUserRedux } from "lib";
import { ssrNextApi as nextApi } from "next-common/services/nextApi";
import { EmptyList } from "next-common/utils/constants";
import Editor from "next-common/components/comment/editor";
import { useEffect, useRef, useState } from "react";
import Layout from "components/layout";
import CommentsWrapper from "next-common/components/styled/commentsWrapper";
import { getFocusEditor, getMentionList, getOnReply } from "utils/post";
import { to404 } from "next-common/utils/serverSideUtil";
import { TYPE_DEMOCRACY_PROPOSAL } from "utils/viewConstants";
import { getMetaDesc } from "../../../utils/viewfuncs";
import Metadata from "components/publicProposal/metadata";
import Timeline from "components/publicProposal/timeline";
import Second from "next-common/components/publicProposal/second";
import OutWrapper from "next-common/components/styled/outWrapper";
import useApi from "next-common/utils/hooks/useSelectedEnpointApi";
import useIsMounted from "next-common/utils/hooks/useIsMounted";
import useAddressBalance from "next-common/utils/hooks/useAddressBalance";

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

function isNewDepositors(depositors) {
  return Array.isArray(depositors[0]);
}

export default withLoginUserRedux(({ loginUser, detail, comments, chain }) => {
  const postId = detail?._id;

  const editorWrapperRef = useRef(null);
  const [quillRef, setQuillRef] = useState(null);
  const [content, setContent] = useState("");
  const [contentType, setContentType] = useState(
    loginUser?.preference.editor || "markdown"
  );

  const publicProposal = detail?.onchainData;
  const proposalIndex = publicProposal?.proposalIndex;
  const state = publicProposal?.state?.state;
  const isEnded = ["Tabled", "Canceled"].includes(state);
  const hasTurnIntoReferendum = state === "Tabled";
  const hasCanceled = state === "Canceled";

  const timeline = publicProposal?.timeline;
  const lastTimelineBlockHeight =
    timeline?.[timeline?.length - 1]?.indexer.blockHeight;

  const [seconds, setSeconds] = useState([]);
  const [depositRequired, setDepositRequired] = useState(0);
  const [isLoadingSeconds, setIsLoadingSeconds] = useState(true);
  const api = useApi(chain);
  const isMounted = useIsMounted();
  const [triggerUpdate, setTriggerUpdate] = useState(0);

  useEffect(() => {
    if (!api) {
      return;
    }

    setIsLoadingSeconds(true);

    Promise.resolve(api)
      .then((api) => {
        if (isEnded) {
          return api.rpc.chain
            .getBlockHash(lastTimelineBlockHeight - 1)
            .then((blockHash) => api.at(blockHash));
        }
        return api;
      })
      .then((api) => api.query.democracy.depositOf(proposalIndex))
      .then((res) => {
        if (isMounted.current) {
          const deposit = res.toJSON();
          if (deposit) {
            if (isNewDepositors(deposit)) {
              setSeconds(deposit[0]);
              setDepositRequired(deposit[1]);
            } else {
              setSeconds(deposit[1]);
              setDepositRequired(deposit[0]);
            }
          }
        }
      })
      .catch(console.error)
      .finally(() => {
        if (isMounted.current) {
          setIsLoadingSeconds(false);
        }
      });
  }, [
    proposalIndex,
    isEnded,
    api,
    lastTimelineBlockHeight,
    isMounted,
    triggerUpdate,
  ]);

  const users = getMentionList(comments);

  const focusEditor = getFocusEditor(contentType, editorWrapperRef, quillRef);

  const onReply = getOnReply(
    contentType,
    content,
    setContent,
    quillRef,
    focusEditor
  );

  detail.status = detail?.onchainData?.state?.state;

  const desc = getMetaDesc(detail, "Proposal");
  return (
    <Layout
      user={loginUser}
      chain={chain}
      seoInfo={{ title: detail?.title, desc }}
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
            seconds={seconds}
            depositRequired={depositRequired}
            hasTurnIntoReferendum={hasTurnIntoReferendum}
            hasCanceled={hasCanceled}
            updateSeconds={() => setTriggerUpdate(Date.now())}
            updateTimeline={() => {}}
            isLoadingSeconds={isLoadingSeconds}
            setIsLoadingSeconds={setIsLoadingSeconds}
            useAddressVotingBalance={useAddressBalance}
          />
          <Metadata proposal={detail?.onchainData} chain={chain} />
          <Timeline timeline={detail?.onchainData?.timeline} chain={chain} />
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
                {...{ contentType, setContentType, content, setContent, users }}
                type={TYPE_DEMOCRACY_PROPOSAL}
              />
            )}
          </CommentsWrapper>
        </Wrapper>
      </OutWrapper>
    </Layout>
  );
});

export const getServerSideProps = withLoginUser(async (context) => {
  const chain = process.env.CHAIN;

  const { id, page, page_size: pageSize } = context.query;

  const [{ result: detail }] = await Promise.all([
    nextApi.fetch(`democracy/proposals/${id}`),
  ]);

  if (!detail) {
    return to404(context);
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
      comments: comments ?? EmptyList,
      chain,
    },
  };
});
