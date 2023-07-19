import styled from "styled-components";
import isNil from "lodash.isnil";
import React from "react";
import ReasonLink from "../reasonLink";
import Link from "next/link";
import { Index } from "./styled";

const TitleWrapper = styled.div`
  flex: 1;
  overflow: hidden;
  color: var(--textPrimary);
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

      <Link href={href} passHref legacyBehavior>
        <Title>{title}</Title>
      </Link>
      <ReasonLink text={data.title} hideText={true} />
    </TitleWrapper>
  );
}
