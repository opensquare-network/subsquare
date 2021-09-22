import styled from "styled-components";

import Back from "components/back";
import DetailItem from "components/detailItem";
import Comments from "components/comment";
import { withLoginUser, withLoginUserRedux } from "lib";
import { ssrNextApi as nextApi } from "services/nextApi";
import { EmptyList } from "utils/constants";
import Input from "components/comment/input";
import { useState, useRef } from "react";
import LayoutFixedHeader from "components/layoutFixedHeader";
import { getTimelineStatus, getNode, toPrecision } from "utils";
import Timeline from "components/timeline";
import dayjs from "dayjs";
import User from "components/user";
import KVList from "components/kvList";
import Links from "components/timeline/links";
import ReasonLink from "components/reasonLink";
import { getTipState } from "utils/viewfuncs";
import {
  getFocusEditor,
  getMentionList,
  getOnReply,
} from "../../../../utils/post";

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
  box-shadow: 0 6px 7px rgba(30, 33, 52, 0.02),
    0 1.34018px 1.56354px rgba(30, 33, 52, 0.0119221),
    0 0.399006px 0.465507px rgba(30, 33, 52, 0.00807786);
  border-radius: 6px;
  padding: 48px;
  @media screen and (max-width: 768px) {
    padding: 24px;
    border-radius: 0;
  }
`;
const FlexEnd = styled.div`
  display: flex;
  justify-content: right;
`;

const isClosed = (timeline) => {
  return (timeline || []).find((item) => item.method === "TipClosed");
};

const getClosedTimelineData = (timeline) => {
  let firstTipIndex = -1;
  let lastTipIndex = -1;
  (timeline || []).forEach((item, index) => {
    if (item.method === "tip") {
      if (firstTipIndex === -1) {
        firstTipIndex = index;
      }
      if (lastTipIndex < index) {
        lastTipIndex = index;
      }
    }
  });
  if (firstTipIndex > 0) {
    firstTipIndex--;
  }
  if (firstTipIndex >= lastTipIndex) {
    return timeline;
  } else {
    const rv = [];
    const fd = [];
    (timeline || []).forEach((item, index) => {
      if (index === firstTipIndex) {
        rv.push(fd);
      }
      if (index >= firstTipIndex && index <= lastTipIndex) {
        fd.push(item);
      } else {
        rv.push(item);
      }
    });
    return rv;
  }
};

export default withLoginUserRedux(({ loginUser, detail, comments, chain }) => {
  if (!detail) {
    return "404"; //TODO: improve
  }

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
      case "reportAwesome":
        return {
          Finder: (
            <FlexEnd>
              <User chain={chain} add={args.finder} />
            </FlexEnd>
          ),
          Beneficiary: (
            <FlexEnd>
              <User chain={chain} add={args.beneficiary} />
            </FlexEnd>
          ),
          Reason: args.reason,
        };
      case "tip":
        return {
          Tipper: (
            <FlexEnd>
              <User chain={chain} add={args.tipper} />
            </FlexEnd>
          ),
          Value: `${toPrecision(args.award ?? 0, decimals)} ${symbol}`,
        };
      case "TipClosed":
        return {
          Beneficiary: (
            <FlexEnd>
              <User chain={chain} add={args.beneficiary} />
            </FlexEnd>
          ),
          Payout: `${toPrecision(args.payout ?? 0, decimals)} ${symbol}`,
        };
    }
    return args;
  };

  let timeline = (detail?.onchainData?.timeline || []).map((item) => {
    return {
      time: dayjs(item.indexer.blockTime).format("YYYY-MM-DD HH:mm:ss"),
      indexer: item.indexer,
      status: getTimelineStatus("tip", item.method),
      data: getTimelineData(item.args, item.method),
      method: item.method,
    };
  });

  if (isClosed(timeline)) {
    timeline = getClosedTimelineData(timeline);
  }

  const users = getMentionList(comments);

  const focusEditor = getFocusEditor(contentType, editorWrapperRef, quillRef);

  const onReply = getOnReply(
    contentType,
    content,
    setContent,
    quillRef,
    focusEditor
  );

  detail.status = getTipState({
    state: detail.onchainData?.state?.state,
    tipsCount: (detail.onchainData?.meta?.tips || []).length,
  });

  const metadata = [
    [
      "Reason",
      <div>
        <ReasonLink text={detail.onchainData?.meta?.reason} />
      </div>,
    ],
    ["Hash", detail.onchainData?.hash],
    [
      "Finder",
      <>
        <User
          chain={chain}
          add={detail.onchainData?.meta?.finder}
          fontSize={14}
        />
        <Links
          chain={chain}
          address={detail.onchainData?.meta?.finder}
          style={{ marginLeft: 8 }}
        />
      </>,
    ],
    [
      "Beneficiary",
      <>
        <User chain={chain} add={detail.onchainData?.meta?.who} fontSize={14} />
        <Links
          chain={chain}
          address={detail.onchainData?.meta?.who}
          style={{ marginLeft: 8 }}
        />
      </>,
    ],
  ];

  return (
    <LayoutFixedHeader user={loginUser} chain={chain}>
      <Wrapper className="post-content">
        <Back href={`/${chain}/treasury/tips`} text="Back to Tips" />
        <DetailItem
          data={detail}
          user={loginUser}
          chain={chain}
          onReply={focusEditor}
          type="treasury/tip"
        />

        <KVList title="Metadata" data={metadata} />
        {timeline?.length > 0 && (
          <Timeline data={timeline} chain={chain} indent={false} />
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
              type="treasury/tip"
            />
          )}
        </CommentsWrapper>
      </Wrapper>
    </LayoutFixedHeader>
  );
});

export const getServerSideProps = withLoginUser(async (context) => {
  const { chain, id, page, page_size: pageSize } = context.query;

  const [{ result: detail }] = await Promise.all([
    nextApi.fetch(`${chain}/treasury/tips/${id}`),
  ]);

  if (!detail) {
    const { res } = context;
    res.statusCode = 302;
    res.setHeader("Location", `/404`);
    res.end();
  }

  const { result: comments } = await nextApi.fetch(
    `${chain}/treasury/tips/${detail._id}/comments`,
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
