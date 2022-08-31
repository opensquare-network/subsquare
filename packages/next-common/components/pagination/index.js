import React from "react";
import styled, { css } from "styled-components";
import PageCaret from "./caret";
import Items from "./items";

const Wrapper = styled.div`
  padding-top: 8px;
  display: flex;
  align-items: center;
  justify-content: center;

  > :not(:first-child) {
    margin-left: 8px;
  }
`;

const Nav = styled.div`
  cursor: pointer;
  width: 28px;
  height: 28px;
  border-radius: 4px;
  display: flex;
  align-items: center;
  justify-content: center;

  svg {
    path {
      stroke: ${(props) => props.theme.textSecondary};
    }
  }

  :hover {
    background: ${(props) => props.theme.grey100Bg};
  }

  ${(p) =>
    p.disabled &&
    css`
      cursor: auto;
      pointer-events: none;
      svg {
        path {
          stroke: ${(props) => props.theme.textTertiary};
        }
      }

      :hover {
        background: none;
      }
    `}
`;

const PAGE_OFFSET = 1;

export default function Pagination({
  page,
  pageSize,
  total,
  onPageChange = null,
}) {
  const totalPages = Math.ceil(total / pageSize)
    ? Math.ceil(total / pageSize)
    : 1;

  const prevPage = Math.max(1, page + 1 - 1 - PAGE_OFFSET);
  const nextPage = Math.min(totalPages, page + 1 + 1 - PAGE_OFFSET);

  return (
    <Wrapper>
      <Nav disabled={page === 1}>
        <PageCaret isPre={true} page={prevPage} onPageChange={onPageChange} />
      </Nav>
      <Items page={page} total={totalPages - 1} onPageChange={onPageChange} />
      <Nav disabled={page === totalPages}>
        <PageCaret isPre={false} page={nextPage} onPageChange={onPageChange} />
      </Nav>
    </Wrapper>
  );
}
