import styled, { css } from "styled-components";
import { useState } from "react";
import Link from "next/link";

import { timeDurationFromNow } from "utils";
import Markdown from "components/markdown";
import HtmlRender from "./post/htmlRender";
import Actions from "components/actions";
import PostEdit from "components/post/postEdit";
import nextApi from "services/nextApi";
import { addToast } from "store/reducers/toastSlice";
import User from "components/user";
import { useDispatch } from "react-redux";
import EditIcon from "../public/imgs/icons/edit.svg";
import TriangleRight from "../public/imgs/icons/arrow-triangle-right.svg";
import Tag from "./tag";
import Flex from "./common/flex";

const Wrapper = styled.div`
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

const Divider = styled.div`
  height: 1px;
  background: #ebeef4;
  margin: 16px 0;
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

export default function DetailItem({ data, user, chain, onReply, type }) {
  const dispatch = useDispatch();
  const [post, setPost] = useState(data);
  const [isEdit, setIsEdit] = useState(false);
  const [thumbUpLoading, setThumbUpLoading] = useState(false);
  const [showThumbsUpList, setShowThumbsUpList] = useState(false);
  if (!post) {
    return null;
  }

  const isLoggedIn = !!user;
  let ownPost = false;
  if (type === "post") {
    ownPost = isLoggedIn && post.author?.username === user.username;
  } else {
    ownPost =
      isLoggedIn &&
      !!(user.addresses || []).find((item) =>
        post?.onchainData?.authors?.includes(item.address)
      );
  }

  const thumbUp =
    isLoggedIn &&
    post.reactions?.findIndex((r) => r.user?.username === user.username) > -1;

  const updatePost = async () => {
    const url = `${chain}/${type}s/${post._id}`;
    const { result: newPost } = await nextApi.fetch(url);
    if (newPost) {
      setPost(newPost);
    }
  };

  const toggleThumbUp = async () => {
    if (isLoggedIn && !ownPost && !thumbUpLoading) {
      setThumbUpLoading(true);
      try {
        let result, error;

        if (thumbUp) {
          ({ result, error } = await nextApi.delete(
            `${chain}/${type}s/${post._id}/reaction`
          ));
        } else {
          ({ result, error } = await nextApi.put(
            `${chain}/${type}s/${post._id}/reaction`,
            { reaction: 1 },
            { credentials: "include" }
          ));
        }

        if (result) {
          await updatePost();
        }
        if (error) {
          dispatch(
            addToast({
              type: "error",
              message: error.message,
            })
          );
        }
      } finally {
        setThumbUpLoading(false);
      }
    }
  };

  return (
    <Wrapper>
      {!isEdit && (
        <>
          {type === "democracy/external" && (
            <ReferendaWrapper>
              <div>{`External`}</div>
              {post?.onchainData?.techCommMotionIndex !== undefined && (
                <div>
                  <TriangleRight />
                  <Link
                    href={`/${chain}/techcomm/proposal/${post?.onchainData?.techCommMotionIndex}`}
                  >
                    {`Proposal #${post?.onchainData?.techCommMotionIndex}`}
                  </Link>
                </div>
              )}
              {post?.referendumIndex !== undefined && (
                <div>
                  <TriangleRight />
                  <Link
                    href={`/${chain}/democracy/referendum/${post?.referendumIndex}`}
                  >
                    {`Referenda #${post?.referendumIndex}`}
                  </Link>
                </div>
              )}
            </ReferendaWrapper>
          )}
          {type === "democracy/proposal" && (
            <ReferendaWrapper>
              <div>{`Proposal #${post.proposalIndex}`}</div>
              {post?.referendumIndex !== undefined && (
                <div>
                  <TriangleRight />
                  <Link
                    href={`/${chain}/democracy/referendum/${post.referendumIndex}`}
                  >
                    {`Referenda #${post?.referendumIndex}`}
                  </Link>
                </div>
              )}
            </ReferendaWrapper>
          )}
          {type === "democracy/referenda" &&
            post.externalProposalHash !== undefined && (
              <ReferendaWrapper>
                <Link
                  href={`/${chain}/democracy/external/${post.indexer.blockHeight}_${post.externalProposalHash}`}
                >
                  {`External`}
                </Link>
                {post?.onchainData?.techCommMotionIndex !== undefined && (
                  <div>
                    <TriangleRight />
                    <Link
                      href={`/${chain}/techcomm/proposal/${post?.onchainData?.techCommMotionIndex}`}
                    >
                      {`Proposal #${post?.onchainData?.techCommMotionIndex}`}
                    </Link>
                  </div>
                )}
                <div>
                  <TriangleRight />
                  <div>{`Referenda #${post?.referendumIndex}`}</div>
                </div>
              </ReferendaWrapper>
            )}
          {type === "democracy/referenda" && post.proposalIndex !== undefined && (
            <ReferendaWrapper>
              <Link href={`/${chain}/democracy/proposal/${post.proposalIndex}`}>
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
              {(post.indexer?.blockTime || post.createdAt) && (
                <Info>
                  Created{" "}
                  {timeDurationFromNow(
                    post.indexer?.blockTime || post.createdAt
                  )}
                </Info>
              )}
              {post.commentsCount > -1 && (
                <Info>{`${post.commentsCount} Comments`}</Info>
              )}
            </DividerWrapper>
            {post.status && <Tag name={post.status} />}
          </FlexWrapper>
          <Divider />
          {post.content === "" && (
            <PlaceHolder>
              {`The ${type} has not been edited by creator.`}
              {ownPost && (
                <Edit
                  onClick={() => {
                    setIsEdit(true);
                  }}
                >
                  <EditIcon />
                  Edit
                </Edit>
              )}
            </PlaceHolder>
          )}
          {post.content === "" && (
            <GreyWrapper>
              <span style={{ marginRight: 12 }}>Who can edit?</span>
              {(post.onchainData?.authors || []).map((author) => (
                <GreyItem key={author}>
                  <User
                    add={author}
                    chain={chain}
                    showAvatar={false}
                    fontSize={12}
                  />
                </GreyItem>
              ))}
            </GreyWrapper>
          )}
          {post.contentType === "markdown" && <Markdown md={post.content} />}
          {post.contentType === "html" && <HtmlRender html={post.content} />}
          {post.createdAt !== post.updatedAt && (
            <EditedLabel>Edited</EditedLabel>
          )}
          <Actions
            highlight={isLoggedIn && thumbUp}
            noHover={!isLoggedIn || ownPost}
            edit={ownPost}
            setIsEdit={setIsEdit}
            toggleThumbUp={toggleThumbUp}
            count={post.reactions?.length}
            showThumbsUpList={showThumbsUpList}
            setShowThumbsUpList={setShowThumbsUpList}
            onReply={onReply}
          />
          {showThumbsUpList && post.reactions?.length > 0 && (
            <GreyWrapper style={{ marginTop: 10 }}>
              {post.reactions
                .filter((r) => r.user)
                .map((r, index) => (
                  <GreyItem key={index}>
                    <User
                      user={r.user}
                      fontSize={12}
                      chain={chain}
                      showAvatar={false}
                    />
                  </GreyItem>
                ))}
            </GreyWrapper>
          )}
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
