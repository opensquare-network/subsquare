/* eslint-disable react/jsx-key */
import React, { useEffect, useRef, useState } from "react";
import styled from "styled-components";

import Back from "next-common/components/back";
import { withLoginUser, withLoginUserRedux } from "lib";
import { ssrNextApi as nextApi } from "services/nextApi";
import { EmptyList } from "next-common/utils/constants";
import Layout from "components/layout";
import Comments from "next-common/components/comment";
import Editor from "next-common/components/comment/editor";
import DetailItem from "components/detailItem";
import KVList from "next-common/components/kvList";
import User from "next-common/components/user";
import Links from "next-common/components/links";
import Vote from "components/referenda/vote";
import Timeline from "next-common/components/timeline";
import CommentsWrapper from "next-common/components/styled/commentsWrapper";
import MotionProposal from "components/motion/motionProposal";
import { getFocusEditor, getMentionList, getOnReply } from "utils/post";
import { isSafari } from "utils/serverSideUtil";
import { to404 } from "next-common/utils/serverSideUtil";
import { getDemocracyTimelineData } from "utils/timeline/democracyUtil";
import { TYPE_DEMOCRACY_REFERENDUM } from "utils/viewConstants";
import { useApi } from "utils/hooks";
import useIsMounted from "next-common/utils/hooks/useIsMounted";
import { getMetaDesc } from "utils/viewfuncs";
import SEO from "next-common/components/SEO";
import OutWrapper from "next-common/components/styled/outWrapper";

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
  ({ loginUser, detail, publicProposal, comments, chain, siteUrl }) => {
    const api = useApi(chain);
    const editorWrapperRef = useRef(null);
    const [quillRef, setQuillRef] = useState(null);
    const [content, setContent] = useState("");
    const [contentType, setContentType] = useState(
      loginUser?.preference.editor || "markdown"
    );
    const [referendumStatus, setReferendumStatus] = useState(
      detail?.onchainData?.status
    );
    const isMounted = useIsMounted();
    const [isLoadingReferendumStatus, setIsLoadingReferendumStatus] =
      useState(false);

    useEffect(() => {
      // Already has the last ongoging status
      if (referendumStatus) {
        return;
      }

      setIsLoadingReferendumStatus(true);
      api?.query.democracy
        .referendumInfoOf(detail.referendumIndex)
        .then((referendumInfo) => {
          const referendumInfoData = referendumInfo.toJSON();
          if (isMounted.current) {
            setReferendumStatus(referendumInfoData?.ongoing);
          }
        })
        .finally(() => {
          setIsLoadingReferendumStatus(false);
        });
    }, [api, detail, isMounted, referendumStatus]);

    const focusEditor = getFocusEditor(contentType, editorWrapperRef, quillRef);

    const onReply = getOnReply(
      contentType,
      content,
      setContent,
      quillRef,
      focusEditor
    );

    const completeTimeline = (
      publicProposal?.onchainData?.timeline || []
    ).concat(detail?.onchainData?.timeline || []);
    const timelineData = getDemocracyTimelineData(completeTimeline, chain);

    const metadata = [
      [
        "Proposer",
        <>
          <User add={detail.proposer} fontSize={14} />
          <Links
            chain={chain}
            address={detail.proposer}
            style={{ marginLeft: 8 }}
          />
        </>,
      ],
      ["Delay", referendumStatus?.delay],
      ["End", referendumStatus?.end],
      ["Threshold", referendumStatus?.threshold],
    ];

    if (detail?.onchainData?.preImage) {
      metadata.push([
        <MotionProposal
          motion={{ proposal: detail.onchainData.preImage.call }}
          chain={chain}
        />,
      ]);
    }

    detail.status = detail.onchainData?.state?.state;

    const desc = getMetaDesc(detail, "Referendum");
    return (
      <Layout user={loginUser} chain={chain}>
        <SEO
          title={detail?.title}
          desc={desc}
          siteUrl={siteUrl}
          chain={chain}
        />
        <OutWrapper>
          <Wrapper className="post-content">
            <Back href={`/democracy/referendums`} text="Back to Referendas" />
            <DetailItem
              data={detail}
              onReply={focusEditor}
              user={loginUser}
              chain={chain}
              type={TYPE_DEMOCRACY_REFERENDUM}
            />

            <Vote
              referendumInfo={detail?.onchainData?.info}
              referendumStatus={referendumStatus}
              setReferendumStatus={setReferendumStatus}
              chain={chain}
              referendumIndex={detail?.referendumIndex}
              isLoadingReferendumStatus={isLoadingReferendumStatus}
              setIsLoadingReferendumStatus={setIsLoadingReferendumStatus}
            />

            <KVList title={"Metadata"} data={metadata} />

            <Timeline data={timelineData} chain={chain} />

            <CommentsWrapper>
              <Comments
                data={comments}
                user={loginUser}
                chain={chain}
                onReply={onReply}
              />
              {loginUser && (
                <Editor
                  postId={detail._id}
                  chain={chain}
                  ref={editorWrapperRef}
                  setQuillRef={setQuillRef}
                  {...{
                    contentType,
                    setContentType,
                    content,
                    setContent,
                    users: getMentionList(comments),
                  }}
                  type={TYPE_DEMOCRACY_REFERENDUM}
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
  isSafari(context);
  const { id, page, page_size: pageSize } = context.query;

  const [{ result: detail }] = await Promise.all([
    nextApi.fetch(`democracy/referendums/${id}`),
  ]);

  if (!detail) {
    return to404(context);
  }

  let publicProposal = null;
  if ((detail.proposalIndex ?? null) !== null) {
    const result = await nextApi.fetch(
      `democracy/proposals/${detail.proposalIndex}`
    );
    publicProposal = result.result;
  }

  const postId = detail?._id;

  const { result: comments } = await nextApi.fetch(
    `democracy/referendums/${postId}/comments`,
    {
      page: page ?? "last",
      pageSize: Math.min(pageSize ?? 50, 100),
    }
  );

  return {
    props: {
      detail: detail ?? {},
      publicProposal,
      comments: comments ?? EmptyList,
      chain,
      siteUrl: process.env.SITE_URL,
    },
  };
});
