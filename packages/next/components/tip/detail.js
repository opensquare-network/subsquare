import styled, { css } from "styled-components";
import { useState } from "react";

import { addressEllipsis, timeDuration } from "utils";
import Markdown from "components/markdown";
import HtmlRender from "../post/htmlRender";
import Actions from "components/actions";
import PostEdit from "components/post/postEdit";
import nextApi from "services/nextApi";
import { addToast } from "store/reducers/toastSlice";
import User from "components/user";
import { useDispatch } from "react-redux";

const Wrapper = styled.div`
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
  :hover {
    .edit {
      display: block;
    }
  }
`;

const DividerWrapper = styled.div`
  display: flex;
  align-items: center;
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
  font-weight: bold;
  font-size: 12px;
`;

const Info = styled.div`
  font-size: 12px;
  color: #506176;
`;

const Title = styled.div`
  max-width: 750px;
  overflow: hidden;
  word-break: break-all;
  font-weight: 500;
  font-size: 20px;
  line-height: 140%;
  margin-bottom: 12px;
`;

const Divider = styled.div`
  height: 1px;
  background: #ebeef4;
  margin: 16px 0;
`;

const FooterWrapper = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  flex-wrap: wrap;
`;

const TypeWrapper = styled.div`
  display: inline-block;
  height: 20px;
  line-height: 20px;
  border-radius: 10px;
  background: #1e2134;
  color: #ffffff;
  font-weight: 500;
  font-size: 12px;
  padding: 0 8px;
  ${(p) =>
    p.color &&
    css`
      background: ${p.color};
    `}
`;

const StatusWrapper = styled.div`
  background: #2196f3;
  border-radius: 2px;
  font-weight: 500;
  font-size: 12px;
  height: 20px;
  line-height: 20px;
  padding: 0 8px;
  color: #ffffff;
`;

const TextWrapper = styled.div`
  height: 160px;
  background: #f6f7fa;
  display: flex;
  align-items: center;
  justify-content: center;
  margin-top: 24px;
`;

const EditedLabel = styled.div`
  margin-top: 8px;
  font-style: normal;
  font-weight: normal;
  font-size: 12px;
  color: #9da9bb;
`;

const SupporterWrapper = styled.div`
  display: flex;
  flex-flow: wrap;
  font-style: normal;
  font-weight: normal;
  font-size: 12px;
  line-height: 22px;
  padding: 8px 12px;
  background: #f6f7fa;
  border-radius: 4px;
  margin: 16px 0 00;
`;

const SupporterItem = styled.div`
  display: inline-block;
  margin-right: 12px;
  > .username {
    color: #506176;
  }
`;

const getTypeColor = (type) => {
  switch (type) {
    case "Council":
      return "#E81F66";
    case "Treasury":
      return "#FF9800";
    default:
      return null;
  }
};

export default function DetailItem({ data, user, chain, onReply }) {
  const dispatch = useDispatch();
  const [post, setPost] = useState(data);
  const [isEdit, setIsEdit] = useState(false);
  const [thumbUpLoading, setThumbUpLoading] = useState(false);
  const [showThumbsUpList, setShowThumbsUpList] = useState(false);

  const isLoggedIn = !!user;
  const ownPost = isLoggedIn && post.author?.username === user.username;
  const thumbUp =
    isLoggedIn &&
    post?.reactions?.findIndex((r) => r.user?.username === user.username) > -1;

  const updatePost = async () => {
    const { result: newPost } = await nextApi.fetch(
      `${chain}/tips/${post._id}`
    );
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
          ({ result, error } = await nextApi.fetch(
            `${chain}/tips/${post._id}/reaction`,
            {},
            {
              method: "DELETE",
            }
          ));
        } else {
          ({ result, error } = await nextApi.fetch(
            `${chain}/tips/${post._id}/reaction`,
            {},
            {
              method: "PUT",
              body: JSON.stringify({ reaction: 1 }),
              headers: { "Content-Type": "application/json" },
            }
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
          <Title>{post.title}</Title>
          <DividerWrapper>
            {post.createdAt && (
              <Info>Created {timeDuration(post.createdAt)}</Info>
            )}
            {post.commentsCount > -1 && <Info>{`${post.commentsCount} Comments`}</Info>}
          </DividerWrapper>
          <Divider />
          <FooterWrapper>
            <DividerWrapper>
              <User
                user={
                  post.author ?? {
                    username: addressEllipsis(post.finder),
                    addresses: [{ chain, address: post.finder }],
                  }
                }
                chain={chain}
              />
              {post.type && (
                <div>
                  <TypeWrapper color={getTypeColor(post.type)}>
                    {post.type}
                  </TypeWrapper>
                </div>
              )}
            </DividerWrapper>
            {post.status && <StatusWrapper>{post.status}</StatusWrapper>}
          </FooterWrapper>
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
            count={post?.reactions?.length}
            showThumbsUpList={showThumbsUpList}
            setShowThumbsUpList={setShowThumbsUpList}
            onReply={onReply}
          />
          {showThumbsUpList && post?.reactions?.length > 0 && (
            <SupporterWrapper>
              {post.reactions
                .filter((r) => r.user)
                .map((r, index) => (
                  <SupporterItem key={index}>
                    <User user={r.user} chain={chain} showAvatar={false} />
                  </SupporterItem>
                ))}
            </SupporterWrapper>
          )}
        </>
      )}
      {isEdit && (
        <PostEdit
          chain={chain}
          postData={post}
          setIsEdit={setIsEdit}
          updatePost={updatePost}
        />
      )}
    </Wrapper>
  );
}
