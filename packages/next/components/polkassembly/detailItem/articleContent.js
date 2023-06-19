import React from "react";
import styled from "styled-components";
import Actions from "../actions";
import PostDataSource from "next-common/components/postDataSource";
import { MarkdownPreviewer } from "@osn/previewer";
import RichTextStyleWrapper from "next-common/components/content/richTextStyleWrapper";
import Divider from "next-common/components/styled/layout/divider";

const Wrapper = styled(RichTextStyleWrapper)``;

const PlaceHolder = styled.div`
  font-style: normal;
  font-weight: normal;
  font-size: 14px;
  line-height: 140%;
  text-align: center;
  color: var(--textTertiary);
  height: 68px;
  display: flex;
  align-items: center;
  justify-content: center;
`;

const EditedLabel = styled.div`
  margin-top: 8px;
  font-style: normal;
  font-weight: normal;
  font-size: 12px;
  color: var(--textTertiary);
`;

export default function ArticleContent({ post, type, postReactions }) {
  if (!post) {
    return null;
  }

  return (
    <Wrapper>
      <Divider margin={16} />
      {post.content === "" && (
        <PlaceHolder>
          {`The ${type} has not been edited by creator.`}
        </PlaceHolder>
      )}
      <MarkdownPreviewer content={post.content} />
      {post.createdAt !== post.updatedAt && <EditedLabel>Edited</EditedLabel>}
      <PostDataSource type={type} post={post} />
      <Actions reactions={postReactions} />
    </Wrapper>
  );
}
