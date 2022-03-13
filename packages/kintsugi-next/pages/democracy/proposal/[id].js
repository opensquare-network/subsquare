/* eslint-disable react/jsx-key */
import styled from "styled-components";

import Back from "next-common/components/back";
import DetailItem from "components/detailItem";
import Comments from "next-common/components/comment";
import { withLoginUser, withLoginUserRedux } from "lib";
import { ssrNextApi as nextApi } from "services/nextApi";
import { EmptyList } from "next-common/utils/constants";
import Editor from "next-common/components/comment/editor";
import { useRef, useState } from "react";
import Layout from "components/layout";
import User from "next-common/components/user";
import { getNode, toPrecision } from "utils";
import Link from "next/link";
import Links from "next-common/components/links";
import Timeline from "next-common/components/timeline";
import KVList from "next-common/components/kvList";
import { getFocusEditor, getMentionList, getOnReply } from "utils/post";
import CommentsWrapper from "next-common/components/styled/commentsWrapper";
import { to404 } from "next-common/utils/serverSideUtil";
import { isSafari } from "utils/serverSideUtil";
import { TYPE_DEMOCRACY_PROPOSAL } from "utils/viewConstants";
import { getDemocracyTimelineData } from "utils/timeline/democracyUtil";
import sortTimeline from "utils/timeline/sort";
import { getMetaDesc } from "utils/viewfuncs";
import SEO from "next-common/components/SEO";
import Proposal from "next-common/components/proposal";
import DetailPageWrapper from "next-common/components/styled/detailPageWrapper";

const MetadataProposerWrapper = styled.div`
  display: flex;
  align-items: center;

  > :not(:first-child) {
    margin-left: 8px;
  }
`;

export default withLoginUserRedux(
  ({ loginUser, detail, referendum, comments, chain, siteUrl }) => {
    const postId = detail._id;

    const editorWrapperRef = useRef(null);
    const [quillRef, setQuillRef] = useState(null);
    const [content, setContent] = useState("");
    const [contentType, setContentType] = useState(
      loginUser?.preference.editor || "markdown"
    );

    const node = getNode(chain);
    if (!node) {
      return null;
    }
    const decimals = node.decimals;
    const symbol = node.symbol;

    const completeTimeline = (detail?.onchainData?.timeline || []).concat(
      referendum?.onchainData?.timeline || []
    );
    const timelineData = getDemocracyTimelineData(completeTimeline, chain);
    sortTimeline(timelineData);

    const users = getMentionList(comments);

    const focusEditor = getFocusEditor(contentType, editorWrapperRef, quillRef);

    const onReply = getOnReply(
      contentType,
      content,
      setContent,
      quillRef,
      focusEditor
    );

    const deposit = detail.onchainData.deposit;
    const metadata = [
      ["hash", detail.onchainData?.hash],
      [
        "deposit",
        `${toPrecision(deposit ? deposit[1] : 0, decimals)} ${symbol}`,
      ],
      [
        "proposer",
        <MetadataProposerWrapper>
          <User chain={chain} add={detail.onchainData?.proposer} />
          <Links chain={chain} address={detail.onchainData?.proposer} />
        </MetadataProposerWrapper>,
      ],
    ];

    if (detail?.onchainData?.preImage) {
      metadata.push([
        <Proposal
          motion={{ proposal: detail.onchainData.preImage.call }}
          chain={chain}
        />,
      ]);
    }

    const referendumData = [];
    if ((detail?.referendumIndex ?? null) !== null) {
      referendumData.push([
        "Link to",
        <Link
          href={`/democracy/referendum/${detail.referendumIndex}`}
        >{`Democracy Referenda #${detail.referendumIndex}`}</Link>,
      ]);
    }

    detail.status = detail.onchainData?.state?.state;

    const desc = getMetaDesc(detail, "Proposal");
    return (
      <Layout user={loginUser} chain={chain}>
        <SEO
          title={detail?.title}
          desc={desc}
          siteUrl={siteUrl}
          chain={chain}
        />
        <DetailPageWrapper className="post-content">
          <Back href={`/democracy/proposals`} text="Back to Proposals" />
          <DetailItem
            data={detail}
            user={loginUser}
            chain={chain}
            onReply={focusEditor}
            type={TYPE_DEMOCRACY_PROPOSAL}
          />
          {referendumData.length > 0 && (
            <KVList title="Business" data={referendumData} />
          )}
          <KVList title="Metadata" data={metadata} />
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
                postId={postId}
                chain={chain}
                ref={editorWrapperRef}
                setQuillRef={setQuillRef}
                {...{ contentType, setContentType, content, setContent, users }}
                type={TYPE_DEMOCRACY_PROPOSAL}
              />
            )}
          </CommentsWrapper>
        </DetailPageWrapper>
      </Layout>
    );
  }
);

export const getServerSideProps = withLoginUser(async (context) => {
  const chain = process.env.CHAIN;
  isSafari(context);
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
      siteUrl: process.env.SITE_URL,
    },
  };
});
