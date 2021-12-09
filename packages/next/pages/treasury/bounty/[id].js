import styled from "styled-components";

import Back from "components/back";
import DetailItem from "components/detailItem";
import Comments from "components/comment";
import { withLoginUser, withLoginUserRedux } from "lib";
import { ssrNextApi as nextApi } from "services/nextApi";
import { EmptyList } from "utils/constants";
import Input from "components/comment/input";
import { useState, useRef } from "react";
import Layout from "components/layout";
import Metadata from "components/metadata";
import User from "components/user";
import { getNode, toPrecision } from "utils";
import Links from "components/timeline/links";
import dayjs from "dayjs";
import Timeline from "components/timeline";
import { getTimelineStatus } from "utils";
import { getFocusEditor, getMentionList, getOnReply } from "utils/post";
import { shadow_100 } from "styles/componentCss";
import { to404 } from "utils/serverSideUtil";
import { TYPE_TREASURY_BOUNTY } from "utils/viewConstants";
import { createMotionTimelineData } from "../../../utils/timeline/motion";
import sortTimeline from "../../../utils/timeline/sort";
import { getMetaDesc } from "../../../utils/viewfuncs";
import NextHead from "../../../components/nextHead";

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

const Flex = styled.div`
  display: flex;
  align-items: center; ;
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
      case "proposeBounty":
        return {
          ...args,
          value: `${toPrecision(args.value ?? 0, decimals)} ${symbol}`,
        };
      case "BountyRejected":
        return {
          ...args,
          slashed: `${toPrecision(args.slashed ?? 0, decimals)} ${symbol}`,
        };
      case "Proposed":
        return {
          Index: `#${args.index}`,
        };
      case "Awarded":
        return {
          Beneficiary: <User chain={chain} add={args.beneficiary} />,
          Award: `${toPrecision(args.award ?? 0, decimals)} ${symbol}`,
        };
    }
    return args;
  };

  const timelineData = (detail?.onchainData?.timeline || []).map((item) => {
    const indexer = item.extrinsicIndexer ?? item.indexer;
    return {
      indexer,
      time: dayjs(indexer?.blockTime).format("YYYY-MM-DD HH:mm:ss"),
      status: getTimelineStatus("bounty", item.method ?? item.name),
      data: getTimelineData(item.args, item.method ?? item.name),
    };
  });

  detail?.onchainData?.motions?.forEach((motion) => {
    const motionTimelineData = createMotionTimelineData(motion);
    timelineData.push(motionTimelineData);
  });
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

  const metadata = detail.onchainData?.meta
    ? Object.entries(detail.onchainData?.meta)
    : [];

  metadata.forEach((item) => {
    switch (item[0]) {
      case "proposer":
      case "beneficiary":
        item[1] = (
          <Flex>
            <User chain={chain} add={item[1]} fontSize={14} />
            <Links chain={chain} address={item[1]} style={{ marginLeft: 8 }} />
          </Flex>
        );
        break;
      case "value":
      case "bond":
        item[1] = `${toPrecision(item[1] ?? 0, decimals)} ${symbol}`;
        break;
      case "status":
        item[1] = Object.keys(item[1])[0];
    }
  });

  detail.status = detail.onchainData?.state?.state;

  const desc = getMetaDesc(detail, "Bounty");
  return (
    <Layout user={loginUser} chain={chain}>
      <NextHead
        title={`${detail.title ?? "Subsquare"}`}
        desc={desc}
        type={"post"}
      />
      <Wrapper className="post-content">
        <Back href={`/treasury/bounties`} text="Back to Bounties" />
        <DetailItem
          data={detail}
          user={loginUser}
          chain={chain}
          onReply={focusEditor}
          type={TYPE_TREASURY_BOUNTY}
        />
        <Metadata data={metadata} />
        <Timeline data={timelineData} chain={chain} />
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
              type={TYPE_TREASURY_BOUNTY}
            />
          )}
        </CommentsWrapper>
      </Wrapper>
    </Layout>
  );
});

export const getServerSideProps = withLoginUser(async (context) => {
  const chain = process.env.CHAIN;

  const { id, page, page_size: pageSize } = context.query;

  const [{ result: detail }] = await Promise.all([
    nextApi.fetch(`treasury/bounties/${id}`),
  ]);

  if (!detail) {
    to404(context);
  }

  const { result: comments } = await nextApi.fetch(
    `treasury/bounties/${detail._id}/comments`,
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
