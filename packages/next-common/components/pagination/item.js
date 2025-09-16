import React from "react";
import styled, { css } from "styled-components";
import LinkItem from "./linkItem";

const Item = styled.span`
  padding: 0 8px;
  cursor: pointer;
  min-width: 28px;
  height: 28px;
  border-radius: 4px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 14px;
  font-weight: 500;
  color: var(--textSecondary);

  :hover {
    background: var(--neutral300);
  }

  ${(p) =>
    p.active &&
    css`
      background: var(--neutral300);
      color: var(--textPrimary);
      cursor: auto;
      pointer-events: none;
    `}
`;

export default function PageItem({
  page,
  now,
  onPageChange = null,
  shallow = false,
  buttonMode = false,
}) {
  const content = (
    <Item
      active={now === page}
      role={buttonMode ? "button" : undefined}
      onClick={(e) => {
        onPageChange && onPageChange(e, page);
      }}
    >
      {page}
    </Item>
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
