import styled, { css } from "styled-components";
import { useState } from "react";

import { timeDuration } from "utils";
import Author from "components/author";
import Markdown from "components/markdown";
import HtmlRender from "./post/htmlRender";
import Actions from "components/actions";
import PostEdit from "components/post/postEdit";
import nextApi from "services/nextApi";

const Wrapper = styled.div`
  background: #ffffff;
  border: 1px solid #ebeef4;
  box-shadow: 0px 6px 7px rgba(30, 33, 52, 0.02),
    0px 1.34018px 1.56354px rgba(30, 33, 52, 0.0119221),
    0px 0.399006px 0.465507px rgba(30, 33, 52, 0.00807786);
  border-radius: 4px;
  padding: 48px;
  @media screen and (max-width: 600px) {
    padding: 24px;
    margin: 0 -16px;
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
  font-weight: 500;
  font-size: 28px;
  line-height: 140%;
  margin-top: 8px;
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

export default function DetailItem({ data, user }) {
  const [post, setPost] = useState(data);
  const [isEdit, setIsEdit] = useState(false);
  const isLoggedIn = !!user;
  const ownPost = isLoggedIn && post.author?.username === user.username;

  const updatePost = async () => {
    const { result: newPost } = await nextApi.fetch(`posts/${post._id}`);
    if (newPost) {
      setPost(newPost);
    }
  };

  return (
    <Wrapper>
      {!isEdit && (
        <>
          <DividerWrapper>
            {post.postUid && <Index>{`#${post.postUid}`}</Index>}
            {post.createdAt && (
              <Info>Created {timeDuration(post.createdAt)}</Info>
            )}
            {post.comments > -1 && <Info>{`${post.comments} Comments`}</Info>}
          </DividerWrapper>
          <Title>{post.title}</Title>
          <Divider />
          <FooterWrapper>
            <DividerWrapper>
              <Author
                username={post.author?.username}
                emailMd5={post.author?.emailMd5}
                address={post.author?.addresses?.[0]?.address}
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
            noHover={!isLoggedIn || ownPost}
            edit={ownPost}
            setIsEdit={setIsEdit}
          />
        </>
      )}
      {isEdit && (
        <PostEdit
          postData={post}
          setIsEdit={setIsEdit}
          updatePost={updatePost}
        />
      )}
    </Wrapper>
  );
}
