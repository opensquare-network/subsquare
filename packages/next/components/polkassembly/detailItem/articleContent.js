import React from "react";
import styled from "styled-components";
import Actions from "../actions";
import PostDataSource from "next-common/components/postDataSource";
import { MarkdownPreviewer } from "@osn/previewer";

const Wrapper = styled.div``;

const Divider = styled.div`
  height: 1px;
  background: #ebeef4;
  margin: 16px 0;
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

const EditedLabel = styled.div`
  margin-top: 8px;
  font-style: normal;
  font-weight: normal;
  font-size: 12px;
  color: #9da9bb;
`;

export default function ArticleContent({ post, chain, type, postReactions }) {
  if (!post) {
    return null;
  }

  return (
    <Wrapper>
      <Divider />
      {post.content === "" && (
        <PlaceHolder>
          {`The ${type} has not been edited by creator.`}
        </PlaceHolder>
      )}
      <MarkdownPreviewer content={post.content} />
      {post.createdAt !== post.updatedAt && <EditedLabel>Edited</EditedLabel>}
      {["kusama", "polkadot"].includes(chain) && (
        <PostDataSource type={type} post={post} />
      )}
      <Actions chain={chain} reactions={postReactions} />
    </Wrapper>
  );
}
