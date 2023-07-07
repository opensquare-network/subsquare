import React from "react";
import styled from "styled-components";
import isNil from "lodash.isnil";
import { usePost, usePostTitle } from "../../../context/post";

const TitleWrapper = styled.div`
  overflow: hidden;
  > :not(:first-child) {
    ::before {
      content: "·";
      font-size: 20px;
      line-height: 28px;
      color: var(--textTertiary);
      margin: 0 8px;
    }
  }
`;

const Title = styled.div`
  word-break: break-word;
  font-weight: 500;
  font-size: 20px;
  line-height: 140%;
`;

const Index = styled.div`
  float: left;
  font-weight: 500;
  font-size: 20px;
  line-height: 140%;
`;

export default function PostTitle() {
  const post = usePost();
  const title = usePostTitle();
  const index = post.index || post.motionIndex;

  return (
    <TitleWrapper>
      {!isNil(index) && <Index>{`#${index}`}</Index>}
      <Title className="text-textPrimary">{title}</Title>
    </TitleWrapper>
  );
}
