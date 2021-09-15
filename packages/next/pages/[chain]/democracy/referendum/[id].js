import styled from "styled-components";

import Back from "components/back";
import { useIsomorphicLayoutEffect, withLoginUser, withLoginUserRedux } from "lib";
import nextApi from "services/nextApi";
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

const Flex = styled.div`
  display: flex;
  align-items: center; ;
`;

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
  const decimals = node.decimals;
  const symbol = node.symbol;
  const editorWrapperRef = useRef(null);
  const [quillRef, setQuillRef] = useState(null);
  const [content, setContent] = useState("");
  const [contentType, setContentType] = useState(loginUser?.preference.editor || "markdown");

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
      case "fastTrack":
        return {
          proposalHash: args.find((arg) => arg.name === "proposal_hash").value,
          votingPeriod:
            args.find((arg) => arg.name === "voting_period").value + ` blocks`,
          delay: args.find((arg) => arg.name === "delay").value + ` blocks`,
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

  return (
    <LayoutFixedHeader user={loginUser} chain={chain}>
      <Wrapper className="post-content">
        <Back
          href={`/${chain}/democracy/referendums`}
          text="Back to Referendas"
        />
        <DetailItem
          data={{
            index: detail.referendumIndex,
            ...detail,
            commentsCount: comments.total,
          }}
          onReply={focusEditor}
          user={loginUser}
          chain={chain}
          type="democracy/referenda"
        />

        <Vote referendum={detail.onchainData} chain={chain} />

        <KVList
          title={"Metadata"}
          data={[
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
          ]}
        />

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
