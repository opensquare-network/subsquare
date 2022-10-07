import React from "react";
import styled from "styled-components";
import isNil from "lodash.isnil";
import { useSelector } from "react-redux";
import { postSelector } from "../../../store/reducers/postSlice";

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
  const post = useSelector(postSelector)
  const index = post.index || post.motionIndex;
  const title = post.title;

  return (
    <TitleWrapper>
      {!isNil(index) && <Index>{`#${index}`}</Index>}
      <Title>{title?.trim() || "--"}</Title>
    </TitleWrapper>
  )
}
