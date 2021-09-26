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
import Metadata from "components/metadata";
import User from "components/user";
import { getNode, toPrecision } from "utils";
import Links from "components/timeline/links";
import dayjs from "dayjs";
import Timeline from "components/timeline";
import { getTimelineStatus } from "utils";
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

  function createMotionTimelineData(motion) {
    return (motion?.timeline || []).map((item) => {
      switch (item.method) {
        case "Proposed": {
          return {
            indexer: item.indexer,
            time: dayjs(item.indexer.blockTime).format("YYYY-MM-DD HH:mm:ss"),
            status: { value: `Motion #${motion.index}`, color: "#6848FF" },
            voting: {
              proposer: motion.proposer,
              method: motion.proposal.method,
              args: motion.proposal.args,
              total: motion.voting.threshold,
              ayes: motion.voting.ayes.length,
              nays: motion.voting.nays.length,
            },
          };
        }
        case "Voted": {
          return {
            indexer: item.indexer,
            time: dayjs(item.indexer.blockTime).format("YYYY-MM-DD HH:mm:ss"),
            status: { value: "Vote", color: "#6848FF" },
            voteResult: {
              name: item.args.voter,
              value: item.args.approve,
            },
          };
        }
        default: {
          return {
            indexer: item.indexer,
            time: dayjs(item.indexer.blockTime).format("YYYY-MM-DD HH:mm:ss"),
            status: { value: item.method, color: "#6848FF" },
          };
        }
      }
    });
  }

  const timelineData = (detail?.onchainData?.timeline || []).map((item) => {
    return {
      time: dayjs(item.indexer.blockTime).format("YYYY-MM-DD HH:mm:ss"),
      indexer: item.indexer,
      status: getTimelineStatus("proposal", item.method ?? item.name),
      data: getTimelineData(item.args, item.method ?? item.name),
    };
  });

  const motionTimelineData = createMotionTimelineData(
    detail?.onchainData?.motions?.[0]
  );

  if (motionTimelineData && motionTimelineData.length > 0) {
    timelineData.push(motionTimelineData);
  }

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

  const metadata = detail.onchainData?.meta
    ? Object.entries(detail.onchainData?.meta)
    : [];
  metadata.forEach((item) => {
    switch (item[0]) {
      case "proposer":
      case "beneficiary":
        item[1] = (
          <Flex>
            <User chain={chain} add={item[1]} fontSize={12} />
            <Links chain={chain} address={item[1]} style={{ marginLeft: 8 }} />
          </Flex>
        );
        break;
      case "value":
      case "bond":
        item[1] = `${toPrecision(item[1] ?? 0, decimals)} ${symbol}`;
    }
  });

  detail.status = detail.onchainData?.state?.state;

  return (
    <Layout user={loginUser} chain={chain}>
      <Wrapper className="post-content">
        <Back href={`/${chain}/treasury/proposals`} text="Back to Proposals" />
        <DetailItem
          data={detail}
          user={loginUser}
          chain={chain}
          onReply={focusEditor}
          type="treasury/proposal"
        />
        {detail.onchainData?.meta && <Metadata data={metadata} />}
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
              type="treasury/proposal"
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
    nextApi.fetch(`${chain}/treasury/proposals/${id}`),
  ]);

  if (!detail) {
    to404(context);
  }

  const { result: comments } = await nextApi.fetch(
    `${chain}/treasury/proposals/${detail._id}/comments`,
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
