/* eslint-disable react/jsx-key */
import styled from "styled-components";

import Back from "components/back";
import DetailItem from "components/detailItem";
import Comments from "components/comment";
import { withLoginUser, withLoginUserRedux } from "lib";
import { ssrNextApi as nextApi } from "services/nextApi";
import { EmptyList } from "utils/constants";
import Input from "components/comment/input";
import { useState, useRef } from "react";
import Layout from "packages/next/components/layout";
import User from "components/user";
import { getNode, toPrecision } from "utils";
import Links from "components/timeline/links";
import dayjs from "dayjs";
import Timeline from "components/timeline";
import { getTimelineStatus } from "utils";
import KVList from "../../../../components/kvList";
import MotionProposal from "../../../../components/motion/motionProposal";
import {
  getFocusEditor,
  getMentionList,
  getOnReply,
} from "../../../../utils/post";
import { shadow_100 } from "../../../../styles/componentCss";
import { to404 } from "../../../../utils/serverSideUtil";

const Wrapper = styled.div`
  > :not(:first-child) {
    margin-top: 16px;
  }

  max-width: 848px;
  margin: auto;
`;

const CommentsWrapper = styled.div`
  background: #ffffff;
  border: 1px solid #ebeef4;
  ${shadow_100};
  border-radius: 6px;
  padding: 48px;
  @media screen and (max-width: 768px) {
    padding: 24px;
    border-radius: 0;
  }
`;

const MetadataProposerWrapper = styled.div`
  display: flex;
  align-items: center;

  > :not(:first-child) {
    margin-left: 8px;
  }
`;

const DepositorsWrapper = styled.div`
  display: flex;
  flex-direction: column;
  align-items: flex-end;

  > :not(:first-child) {
    margin-top: 4px;
  }
`;

export default withLoginUserRedux(({ loginUser, detail, comments, chain }) => {
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

  const getTimelineData = (args, method) => {
    switch (method) {
      case "Proposed":
        return {
          Index: `#${args.index}`,
        };
      case "Tabled":
        return {
          "Referenda Index": `#${args.referendumIndex}`,
          Deposit: `${toPrecision(args.deposit ?? 0, decimals)} ${symbol}`,
          Depositors: (
            <DepositorsWrapper>
              {(args.depositors || []).map((item, index) => (
                <User add={item} key={index} />
              ))}
            </DepositorsWrapper>
          ),
        };
    }
    return args;
  };

  const timelineData = (detail?.onchainData?.timeline || []).map((item) => {
    return {
      time: dayjs(item.indexer.blockTime).format("YYYY-MM-DD HH:mm:ss"),
      indexer: item.indexer,
      status: getTimelineStatus("proposal", item.method ?? item.name),
      data: getTimelineData(item.args, item.method ?? item.name),
    };
  });

  timelineData.sort((a, b) => {
    if (Array.isArray(a)) {
      a = a[0];
    }
    if (Array.isArray(b)) {
      b = b[0];
    }
    return a.indexer.blockTime - b.indexer.blockTime;
  });

  const users = getMentionList(comments);

  const focusEditor = getFocusEditor(contentType, editorWrapperRef, quillRef);

  const onReply = getOnReply(
    contentType,
    content,
    setContent,
    quillRef,
    focusEditor
  );

  const metadata = [
    ["hash", detail.onchainData?.hash],
    [
      "deposit",
      `${toPrecision(
        detail.onchainData?.timeline?.find((item) => item.method === "Tabled")
          ?.args?.deposit ?? 0,
        decimals
      )} ${symbol}`,
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
      <MotionProposal
        motion={{ proposal: detail.onchainData.preImage.call }}
        chain={chain}
      />,
    ]);
  }

  detail.status = detail.onchainData?.state?.state;

  return (
    <Layout user={loginUser} chain={chain}>
      <Wrapper className="post-content">
        <Back href={`/${chain}/democracy/proposals`} text="Back to Proposals" />
        <DetailItem
          data={detail}
          user={loginUser}
          chain={chain}
          onReply={focusEditor}
          type="democracy/proposal"
        />
        {metadata && <KVList title="Metadata" data={metadata} />}
        {timelineData && timelineData.length > 0 && (
          <Timeline data={timelineData} chain={chain} />
        )}
        <CommentsWrapper>
          <Comments
            data={comments}
            user={loginUser}
            postId={postId}
            chain={chain}
            onReply={onReply}
          />
          {loginUser && (
            <Input
              postId={postId}
              chain={chain}
              ref={editorWrapperRef}
              setQuillRef={setQuillRef}
              {...{ contentType, setContentType, content, setContent, users }}
              type="democracy/proposal"
            />
          )}
        </CommentsWrapper>
      </Wrapper>
    </Layout>
  );
});

export const getServerSideProps = withLoginUser(async (context) => {
  const { chain, id, page, page_size: pageSize } = context.query;

  const [{ result: detail }] = await Promise.all([
    nextApi.fetch(`${chain}/democracy/proposals/${id}`),
  ]);

  if (!detail) {
    to404(context);
  }

  const { result: comments } = await nextApi.fetch(
    `${chain}/democracy/proposals/${detail._id}/comments`,
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
