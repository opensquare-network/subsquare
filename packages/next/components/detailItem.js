import styled, { css } from "styled-components";
import { useState } from "react";
import Link from "next/link";

import { timeDurationFromNow } from "utils";
import PostEdit from "components/post/postEdit";
import nextApi from "services/nextApi";
import User from "components/user";
import TriangleRight from "../public/imgs/icons/arrow-triangle-right.svg";
import Tag from "./tag";
import Flex from "next-common/components/styled/flex";
import { shadow_100 } from "../styles/componentCss";
import { getPostUpdatedAt, toApiType } from "utils/viewfuncs";
import {
  TYPE_DEMOCRACY_REFERENDUM,
  TYPE_DEMOCRACY_EXTERNAL,
  TYPE_DEMOCRACY_PROPOSAL,
} from "utils/viewConstants";
import ArticleContent from "./articleContent";

const Wrapper = styled.div`
  background: #ffffff;
  border: 1px solid #ebeef4;
  ${shadow_100};
  border-radius: 6px;
  padding: 48px;
  @media screen and (max-width: 768px) {
    padding: 24px;
    border-radius: 0;
  }

  :hover {
    .edit {
      display: block;
    }
  }
`;

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

const Info = styled.div`
  font-size: 12px;
  color: #506176;
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

const EditedLabel = styled.div`
  margin-top: 8px;
  font-style: normal;
  font-weight: normal;
  font-size: 12px;
  color: #9da9bb;
`;

const GreyWrapper = styled.div`
  display: flex;
  flex-flow: wrap;
  font-style: normal;
  font-weight: normal;
  font-size: 12px;
  line-height: 22px;
  padding: 8px 12px;
  background: #f6f7fa;
  border-radius: 4px;
  margin-top: 16px;
`;

const GreyItem = styled.div`
  display: inline-block;
  margin-right: 12px;

  > .username {
    color: #506176;
  }
`;

const PlaceHolder = styled.div`
  font-style: normal;
  font-weight: normal;
  font-size: 14px;
  line-height: 140%;
  text-align: center;
  color: #9da9bb;
  height: 68px;
  display: flex;
  align-items: center;
  justify-content: center;
`;

const Edit = styled.div`
  cursor: pointer;
  font-style: normal;
  font-weight: 500;
  font-size: 14px;
  line-height: 140%;
  text-align: center;
  color: #506176;
  display: flex;
  align-items: center;

  svg {
    margin-left: 8px;
    margin-right: 4px;
  }
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

function getTechCommId(techCommMotion) {
  return `${techCommMotion?.indexer?.blockHeight}_${techCommMotion?.hash}`;
}

function shortTechId(techCommMotion) {
  return techCommMotion.hash.slice(0, 6);
}

export default function DetailItem({ data, user, chain, onReply, type }) {
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
    <Wrapper>
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
                      href={`/techcomm/proposal/${getTechCommId(
                        techCommMotion
                      )}`}
                    >
                      {`Tech. Comm. #${shortTechId(techCommMotion)}`}
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
                  href={`/democracy/external/${post.indexer.blockHeight}_${post.externalProposalHash}`}
                >
                  {`External`}
                </Link>
                {post?.onchainData?.techCommMotions?.map(
                  (techCommMotion, key) => (
                    <div key={key}>
                      <TriangleRight />
                      <Link
                        href={`/techcomm/proposal/${getTechCommId(
                          techCommMotion
                        )}`}
                      >
                        {`Tech. Comm. #${shortTechId(techCommMotion)}`}
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
                <div>
                  <TriangleRight />
                  <div>{`Referenda #${post?.referendumIndex}`}</div>
                </div>
              </ReferendaWrapper>
            )}
          <TitleWrapper>
            {post?.index !== undefined && <Index>{`#${post.index}`}</Index>}
            <Title>{post.title}</Title>
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
                <Info>Updated {timeDurationFromNow(postUpdatedTime)}</Info>
              )}
              {post.commentsCount > -1 && (
                <Info>{`${post.commentsCount} Comments`}</Info>
              )}
            </DividerWrapper>
            {post.status && <Tag name={post.status} />}
          </FlexWrapper>
          <ArticleContent
            chain={chain}
            post={post}
            setPost={setPost}
            user={user}
            type={type}
            onReply={onReply}
          />
        </>
      )}
      {isEdit && (
        <PostEdit
          chain={chain}
          postData={post}
          setIsEdit={setIsEdit}
          updatePost={updatePost}
          type={type}
        />
      )}
    </Wrapper>
  );
}
