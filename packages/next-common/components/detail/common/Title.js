import React from "react";
import styled from "styled-components";
import isNil from "lodash.isnil";
import { usePost, usePostType } from "../../../context/post";
import { getGov2ReferendumTitle } from "../../../utils/gov2/title";
import { detailPageCategory } from "../../../utils/consts/business/category";

const TitleWrapper = styled.div`
  margin-bottom: 8px;
  overflow: hidden;
  > :not(:first-child) {
    ::before {
      content: "·";
      font-size: 20px;
      line-height: 28px;
      color: ${(props) => props.theme.textTertiary};
      margin: 0 8px;
    }
  }
`;

const Title = styled.div`
  max-width: 750px;
  word-break: break-all;
  font-weight: 500;
  font-size: 20px;
  line-height: 140%;
  margin-bottom: 12px;
`;

const Index = styled.div`
  float: left;
  font-weight: 500;
  font-size: 20px;
  line-height: 140%;
`;

export default function PostTitle() {
  const post = usePost();
  const postType = usePostType();
  const index = post.index || post.motionIndex;
  let title = post.title || "--";

  if (postType === detailPageCategory.GOV2_REFERENDUM) {
    title = getGov2ReferendumTitle(post);
  }

  return (
    <TitleWrapper>
      {!isNil(index) && <Index>{`#${index}`}</Index>}
      <Title>{title}</Title>
    </TitleWrapper>
  );
}
