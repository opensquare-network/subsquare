import styled from "styled-components";

import Back from "components/back";
import { withLoginUser, withLoginUserRedux } from "lib";
import { ssrNextApi as nextApi } from "services/nextApi";
import { EmptyList } from "utils/constants";
import LayoutFixedHeader from "components/layoutFixedHeader";
import Comments from "../../../../components/comment";
import Input from "../../../../components/comment/input";
import { useRef, useState } from "react";
import DetailItem from "../../../../components/detailItem";
import KVList from "../../../../components/kvList";
import User from "../../../../components/user";
import Links from "../../../../components/timeline/links";
import { getNode, getTimelineStatus, toPrecision } from "../../../../utils";
import Vote from "../../../../components/referenda/vote";
import dayjs from "dayjs";
import Timeline from "../../../../components/timeline";
import MotionProposal from "../../../../components/motion/motionProposal";
import { getOnReply } from "../../../../utils/post";

const Wrapper = styled.div`
  > :not(:first-child) {
    margin-top: 16px;
  }

  max-width: min(848px, calc(100vw - 64px));
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

export default withLoginUserRedux(({ loginUser, detail, comments, chain }) => {
  const node = getNode(chain);
  if (!node) {
    return null;
  }
  const editorWrapperRef = useRef(null);
  const [quillRef, setQuillRef] = useState(null);
  const [content, setContent] = useState("");
  const [contentType, setContentType] = useState(
    loginUser?.preference.editor || "markdown"
  );

  const onReply = getOnReply(
    contentType,
    content,
    setContent,
    quillRef,
    focusEditor
  );

  const focusEditor = () => {
    if (contentType === "markdown") {
      editorWrapperRef.current?.querySelector("textarea")?.focus();
    } else if (contentType === "html") {
      setTimeout(() => {
        quillRef.current.getEditor().setSelection(99999, 0, "api"); //always put caret to the end
      }, 4);
    }
    editorWrapperRef.current?.scrollIntoView();
  };

  const getTimelineData = (args, method) => {
    switch (method) {
      case "Executed":
        const rawResult = args.result;
        let result;
        if (typeof rawResult === "boolean") {
          result = rawResult;
        } else if (typeof args.result === "object") {
          result = Object.keys(rawResult)[0];
        } else {
          result = JSON.stringify(rawResult);
        }

        return { result };
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
    ["Delay", detail?.onchainData?.status?.delay],
    ["End", detail?.onchainData?.status?.end],
    ["Threshold", detail?.onchainData?.status?.threshold],
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
    <LayoutFixedHeader user={loginUser} chain={chain}>
      <Wrapper className="post-content">
        <Back
          href={`/${chain}/democracy/referendums`}
          text="Back to Referendas"
        />
        <DetailItem
          data={detail}
          onReply={focusEditor}
          user={loginUser}
          chain={chain}
          type="democracy/referenda"
        />

        <Vote referendum={detail.onchainData} chain={chain} />

        <KVList title={"Metadata"} data={metadata} />

        {timelineData && timelineData.length > 0 && (
          <Timeline data={timelineData} chain={chain} />
        )}

        <CommentsWrapper>
          <Comments
            data={comments}
            user={loginUser}
            postId={detail._id}
            chain={chain}
            onReply={onReply}
          />
          {loginUser && (
            <Input
              postId={detail._id}
              chain={chain}
              ref={editorWrapperRef}
              setQuillRef={setQuillRef}
              {...{
                contentType,
                setContentType,
                content,
                setContent,
                users: [],
              }}
              type="democracy/referendum"
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
    nextApi.fetch(`${chain}/democracy/referendums/${id}`),
  ]);

  if (!detail) {
    const { res } = context;
    res.statusCode = 302;
    res.setHeader("Location", `/404`);
    res.end();
  }

  const postId = detail?._id;

  const { result: comments } = await nextApi.fetch(
    `${chain}/democracy/referendums/${postId}/comments`,
    {
      page: page ?? "last",
      pageSize: Math.min(pageSize ?? 50, 100),
    }
  );

  return {
    props: {
      detail: detail ?? {},
      comments: comments ?? EmptyList,
      chain,
    },
  };
});
