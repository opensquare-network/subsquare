import styled from "styled-components";

import Back from "components/back";
import DetailItem from "components/detailItem";
import Comments from "components/comment";
import { withLoginUser, withLoginUserRedux } from "lib";
import nextApi from "services/nextApi";
import { EmptyList } from "utils/constants";
import Input from "components/comment/input";
import { useState, useRef, useEffect } from "react";
import LayoutFixedHeader from "components/layoutFixedHeader";
import Metadata from "components/metadata";
import User from "components/user";
import { getNode, toPrecision } from "utils";
import Links from "components/timeline/links";
import dayjs from "dayjs";
import Timeline from "components/timeline";
import { getTimelineStatus } from "utils";

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
  if (!detail) {
    return "404"; //todo improve this
  }

  const postId = detail._id;

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
      case "Proposed":
        return {
          Index: `#${args.index}`,
        };
      case "Awarded":
        return {
          Beneficiary: <User chain={chain} add={args.beneficiary} />,
          Award: `${toPrecision(args.award ?? 0, decimals)} ${symbol}`,
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

  const metadata = [
    [
      "proposer",
      <MetadataProposerWrapper>
        <User chain={chain} add={detail.onchainData?.proposer} />
        <Links chain={chain} address={detail.onchainData?.proposer} />
      </MetadataProposerWrapper>,
    ],
  ];

  return (
    <LayoutFixedHeader user={loginUser} chain={chain}>
      <Wrapper className="post-content">
        <Back href={`/${chain}/democracy/externals`} text="Back to Externals" />
        <DetailItem
          data={detail}
          user={loginUser}
          chain={chain}
          onReply={focusEditor}
          type="democracy/external"
        />
        {metadata && <Metadata data={metadata} />}
        {/*{timelineData && timelineData.length > 0 && (*/}
        {/*  <Timeline data={timelineData} chain={chain} />*/}
        {/*)}*/}
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
    </LayoutFixedHeader>
  );
});

export const getServerSideProps = withLoginUser(async (context) => {
  const { chain, id, page, page_size: pageSize } = context.query;

  const [{ result: detail }] = await Promise.all([
    nextApi.fetch(`${chain}/democracy/externals/${id}`),
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
    `${chain}/democracy/externals/${detail._id}/comments`,
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
