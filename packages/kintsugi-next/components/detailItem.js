import styled, { css } from "styled-components";
import { useState } from "react";
import Link from "next/link";

import { timeDurationFromNow } from "next-common/utils";
import nextApi from "next-common/services/nextApi";
import User from "next-common/components/user";
import TriangleRight from "public/imgs/icons/arrow-triangle-right.svg";
import Tag from "next-common/components/tag";
import Flex from "next-common/components/styled/flex";
import { getPostUpdatedAt, toApiType } from "utils/viewfuncs";
import {
  TYPE_DEMOCRACY_EXTERNAL,
  TYPE_DEMOCRACY_PROPOSAL,
  TYPE_DEMOCRACY_REFERENDUM,
} from "utils/viewConstants";
import ArticleContent from "next-common/components/articleContent";
import { EditablePanel } from "next-common/components/styled/panel";
import { getMotionId, shortMotionId } from "next-common/utils/motion";
import UpdateIcon from "next-common/assets/imgs/icons/line-chart.svg";
import Info from "next-common/components/styled/info";

const DividerWrapper = styled(Flex)`
  flex-wrap: wrap;

  > :not(:first-child) {
    ::before {
      content: "·";
      font-size: 12px;
      color: #9da9bb;
      margin: 0 8px;
    }
  }
`;

const Index = styled.div`
  float: left;
  font-weight: 500;
  font-size: 20px;
  line-height: 140%;
`;

const Title = styled.div`
  max-width: 750px;
  word-break: break-all;
  font-weight: 500;
  font-size: 20px;
  line-height: 140%;
  margin-bottom: 12px;
`;

const TitleWrapper = styled.div`
  margin-bottom: 8px;
  overflow: hidden;
  > :not(:first-child) {
    ::before {
      content: "·";
      font-size: 20px;
      line-height: 28px;
      color: #9da9bb;
      margin: 0 8px;
    }
  }
`;

const FlexWrapper = styled(Flex)`
  justify-content: space-between;
  flex-wrap: nowrap;
`;

const TypeWrapper = styled.div`
  display: inline-block;
  height: 20px;
  line-height: 20px;
  border-radius: 10px;
  background: #1e2134;
  color: #e81f66;
  font-weight: 500;
  font-size: 12px;
  padding: 0 8px;
  ${(p) =>
    p.color &&
    css`
      background: ${p.color};
    `}
`;

const ReferendaWrapper = styled(Flex)`
  justify-content: center;
  flex-wrap: wrap;
  padding: 12px;
  background: #f6f7fa;
  border-radius: 4px;
  margin-bottom: 16px;
  font-weight: 500;
  color: #506176;

  > div {
    display: flex;
    align-items: center;
  }

  > div > svg {
    margin-right: 8px;
    fill: #9da9bb;
  }

  a {
    color: #1f70c7;
  }

  > :not(:first-child) {
    margin-left: 8px;
  }
`;

const getTypeColor = (type) => {
  switch (type) {
    case "Democracy":
      return "linear-gradient(0deg, #FEF4F7, #FEF4F7), #E81F66";
    case "Council":
      return "#E81F66";
    case "Treasury":
      return "#FF9800";
    default:
      return null;
  }
};

export default function DetailItem({
  data,
  user,
  chain,
  onReply,
  votes,
  myVote,
  type,
}) {
  const [post, setPost] = useState(data);
  const [isEdit, setIsEdit] = useState(false);
  if (!post) {
    return null;
  }

  const updatePost = async () => {
    const url = `${toApiType(type)}/${post._id}`;
    const { result: newPost } = await nextApi.fetch(url);
    if (newPost) {
      setPost(newPost);
    }
  };

  const postUpdatedTime = getPostUpdatedAt(post);

  return (
    <EditablePanel>
      {!isEdit && (
        <>
          {type === TYPE_DEMOCRACY_EXTERNAL && (
            <ReferendaWrapper>
              <div>{`External #${post?.externalProposalHash?.slice(
                0,
                6
              )}`}</div>
              {post?.onchainData?.techCommMotions?.map(
                (techCommMotion, key) => (
                  <div key={key}>
                    <TriangleRight />
                    <Link
                      href={`/techcomm/proposal/${getMotionId(techCommMotion)}`}
                    >
                      {`Tech. Comm. #${shortMotionId(techCommMotion)}`}
                    </Link>
                  </div>
                )
              )}
              {post?.referendumIndex !== undefined && (
                <div>
                  <TriangleRight />
                  <Link href={`/democracy/referendum/${post?.referendumIndex}`}>
                    {`Referenda #${post?.referendumIndex}`}
                  </Link>
                </div>
              )}
            </ReferendaWrapper>
          )}
          {type === TYPE_DEMOCRACY_PROPOSAL && (
            <ReferendaWrapper>
              <div>{`Proposal #${post.proposalIndex}`}</div>
              {post?.onchainData?.techCommMotions?.map(
                (techCommMotion, key) => (
                  <div key={key}>
                    <TriangleRight />
                    <Link
                      href={`/techcomm/proposal/${getMotionId(techCommMotion)}`}
                    >
                      {`Tech. Comm. #${shortMotionId(techCommMotion)}`}
                    </Link>
                  </div>
                )
              )}
              {post?.referendumIndex !== undefined && (
                <div>
                  <TriangleRight />
                  <Link href={`/democracy/referendum/${post.referendumIndex}`}>
                    {`Referenda #${post?.referendumIndex}`}
                  </Link>
                </div>
              )}
            </ReferendaWrapper>
          )}
          {type === TYPE_DEMOCRACY_REFERENDUM &&
            post.externalProposalHash !== undefined && (
              <ReferendaWrapper>
                <Link
                  passHref={true}
                  href={`/democracy/external/${post.indexer.blockHeight}_${post.externalProposalHash}`}
                >
                  <a>
                    {`External #${post?.externalProposalHash?.slice(0, 6)}`}
                  </a>
                </Link>
                {post?.onchainData?.techCommMotions?.map(
                  (techCommMotion, key) => (
                    <div key={key}>
                      <TriangleRight />
                      <Link
                        href={`/techcomm/proposal/${getMotionId(
                          techCommMotion
                        )}`}
                      >
                        {`Tech. Comm. #${shortMotionId(techCommMotion)}`}
                      </Link>
                    </div>
                  )
                )}
                <div>
                  <TriangleRight />
                  <div>{`Referenda #${post?.referendumIndex}`}</div>
                </div>
              </ReferendaWrapper>
            )}
          {type === TYPE_DEMOCRACY_REFERENDUM &&
            post.proposalIndex !== undefined && (
              <ReferendaWrapper>
                <Link href={`/democracy/proposal/${post.proposalIndex}`}>
                  {`Proposal #${post.proposalIndex}`}
                </Link>
                {post?.onchainData?.techCommMotions?.map(
                  (techCommMotion, key) => (
                    <div key={key}>
                      <TriangleRight />
                      <Link
                        href={`/techcomm/proposal/${getMotionId(
                          techCommMotion
                        )}`}
                      >
                        {`Tech. Comm. #${shortMotionId(techCommMotion)}`}
                      </Link>
                    </div>
                  )
                )}
                <div>
                  <TriangleRight />
                  <div>{`Referenda #${post?.referendumIndex}`}</div>
                </div>
              </ReferendaWrapper>
            )}
          <TitleWrapper>
            {post?.index !== undefined && <Index>{`#${post.index}`}</Index>}
            <Title>{post.title?.trim() || "--"}</Title>
          </TitleWrapper>
          <FlexWrapper>
            <DividerWrapper>
              <User
                user={post.author}
                add={post.proposer || post.finder}
                chain={chain}
                fontSize={12}
              />
              {post.type && (
                <div>
                  <TypeWrapper color={getTypeColor(post.type)}>
                    {post.type}
                  </TypeWrapper>
                </div>
              )}
              {postUpdatedTime && (
                <Info>
                  <UpdateIcon />
                  <span>{timeDurationFromNow(postUpdatedTime)}</span>
                </Info>
              )}
              {post.commentsCount > -1 && (
                <Info>{`${post.commentsCount} Comments`}</Info>
              )}
            </DividerWrapper>
            {post.status && <Tag name={post.status} />}
          </FlexWrapper>
        </>
      )}
      <ArticleContent
        chain={chain}
        post={post}
        setPost={setPost}
        user={user}
        type={type}
        onReply={onReply}
        isEdit={isEdit}
        setIsEdit={setIsEdit}
        votes={votes}
        myVote={myVote}
      />
    </EditablePanel>
  );
}
