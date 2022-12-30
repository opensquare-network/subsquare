import styled from "styled-components";
import isNil from "lodash.isnil";
import React from "react";
import ReasonLink from "../reasonLink";
import Link from "next/link";
import businessCategory from "../../utils/consts/business/category";
import { parseGov2TrackName } from "../../utils/gov2";

const TitleWrapper = styled.div`
  flex: 1;
  overflow: hidden;
  color: ${(props) => props.theme.textPrimary};
`;

const Index = styled.div`
  float: left;
  font-weight: 500;
  font-size: 16px;
  line-height: 140%;
  ::after {
    content: "·";
    font-size: 16px;
    line-height: 22.4px;
    color: ${(props) => props.theme.textTertiary};
    margin: 0 8px;
  }
`;

const Title = styled.a`
  word-break: break-word;
  font-weight: 500;
  font-size: 16px;
  cursor: pointer;
  line-height: 140%;

  :hover {
    text-decoration: underline;
  }
`;

export default function ListPostTitle({ data = {}, href }) {
  let title = data.title?.trim() || "--";

  return (
    <TitleWrapper>
      {!isNil(data?.index) && <Index>{`#${data.index}`}</Index>}

      <Link href={href} passHref>
        <Title>{title}</Title>
      </Link>
      <ReasonLink text={data.title} hideText={true} />
    </TitleWrapper>
  );
}
