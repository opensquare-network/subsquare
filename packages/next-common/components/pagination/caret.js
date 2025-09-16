import React from "react";
import CaretLeft from "../../assets/imgs/icons/pager-caret-left.svg";
import CaretRight from "../../assets/imgs/icons/pager-caret-right.svg";
import styled from "styled-components";
import LinkItem from "./linkItem";

const LinkInnerWrapper = styled.span`
  display: inline-flex;
  align-items: center;
  height: 28px;
`;

export default function PageCaret({
  isPre = true,
  page,
  onPageChange = null,
  shallow = false,
  buttonMode = false,
}) {
  const content = (
    <LinkInnerWrapper
      role={buttonMode ? "button" : undefined}
      onClick={(e) => {
        onPageChange && onPageChange(e, page);
      }}
    >
      {isPre ? <CaretLeft /> : <CaretRight />}
    </LinkInnerWrapper>
  );

  if (buttonMode) {
    return content;
  }

  return (
    <LinkItem shallow={shallow} page={page} key={page}>
      {content}
    </LinkItem>
  );
}
