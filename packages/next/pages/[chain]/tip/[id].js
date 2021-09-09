import styled from "styled-components";

import Back from "components/back";
import DetailItem from "components/detailItem";
import Comments from "components/comment";
import { withLoginUser, withLoginUserRedux } from "lib";
import nextApi from "services/nextApi";
import { EmptyList } from "../../../utils/constants";
import Input from "components/comment/input";
import { useState, useRef, useEffect } from "react";
import LayoutFixedHeader from "../../../components/layoutFixedHeader";
import MetaData from "components/tip/metaData";
import { getTimelineStatus, getNode, toPrecision } from "utils";
import Timeline from "components/timeline";
import dayjs from "dayjs";
import User from "components/user";

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
  @media screen and (max-width: 600px) {
    padding: 24px;
    border-radius: 0;
  }
`;

export default withLoginUserRedux(({ loginUser, detail, comments, chain }) => {
  if (!detail) {
    return "404"; //TODO: improve
  }

  const postId = detail._id;
  console.log({ detail });

  const editorWrapperRef = useRef(null);
  const [quillRef, setQuillRef] = useState(null);
  const [content, setContent] = useState("");
  const [contentType, setContentType] = useState("markdown");

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
          Finder: <User chain={chain} add={args.finder} />,
          Beneficiary: <User chain={chain} add={args.beneficiary} />,
          Reason: args.reason,
        };
      case "tip":
        return {
          Tipper: <User chain={chain} add={args.tipper} />,
          Value: `${toPrecision(args.award ?? 0, decimals)} ${symbol}`,
        };
      case "TipClosed":
        return {
          Beneficiary: <User chain={chain} add={args.beneficiary} />,
          Payout: `${toPrecision(args.payout ?? 0, decimals)} ${symbol}`,
        };
    }
    return args;
  };

  const timelineData = (detail?.onchainData?.timeline || []).map((item) => {
    return {
      time: dayjs(item.indexer.blockTime).format("YYYY-MM-DD HH:mm:ss"),
      indexer: item.indexer,
      status: getTimelineStatus("tip", item.method),
      data: getTimelineData(item.args, item.method),
    };
  });

  useEffect(() => {
    if (!localStorage.getItem("contentType")) {
      return localStorage.setItem("contentType", contentType);
    }
    if (contentType !== localStorage.getItem("contentType")) {
      setContentType(localStorage.getItem("contentType"));
    }
  }, []);

  function isUniqueInArray(value, index, self) {
    return self.indexOf(value) === index;
  }

  const users =
    comments?.items
      ?.map((comment) => comment.author.username)
      .filter(isUniqueInArray) ?? [];

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

  const onReply = (username) => {
    let reply = "";
    if (contentType === "markdown") {
      reply = `[@${username}](/member/${username}) `;
      const at = content ? `${reply}` : reply;
      if (content === reply) {
        setContent(``);
      } else {
        setContent(content + at);
      }
    } else if (contentType === "html") {
      const contents = quillRef.current.getEditor().getContents();
      reply = {
        ops: [
          {
            insert: {
              mention: {
                index: "0",
                denotationChar: "@",
                id: username,
                value: username + " &nbsp; ",
              },
            },
          },
          { insert: "\n" },
        ],
      };
      quillRef.current.getEditor().setContents(contents.ops.concat(reply.ops));
    }
    focusEditor();
  };

  return (
    <LayoutFixedHeader user={loginUser} chain={chain}>
      <Wrapper className="post-content">
        <Back href={`/${chain}/tips`} text="Back to Tips" />
        <DetailItem
          data={detail}
          user={loginUser}
          chain={chain}
          onReply={focusEditor}
          type="tip"
        />
        <MetaData
          metadata={{
            ...detail.onchainData?.meta,
            hash: detail.onchainData?.hash,
          }}
          chain={chain}
        />
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
              type="tip"
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
    nextApi.fetch(`${chain}/tips/${id}`),
  ]);

  if (!detail) {
    return {
      props: {
        detail: null,
        comments: EmptyList,
        chain,
      },
    };
  }

  const { result: comments } = await nextApi.fetch(
    `${chain}/tips/${detail._id}/comments`,
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
