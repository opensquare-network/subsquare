import React from "react";
import styled, { css } from "styled-components";
import { isNil } from "lodash-es";
import { SystemLoading } from "@osn/icons/subsquare";
import { cn } from "next-common/utils/clsx";
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
      stroke: var(--textSecondary);
    }
  }

  :hover {
    background: var(--neutral200);
  }

  ${(p) =>
    p.disabled &&
    css`
      cursor: auto;
      pointer-events: none;
      svg {
        path {
          stroke: var(--textTertiary);
        }
      }

      :hover {
        background: none;
      }
    `}
`;

export default function Pagination({
  page = 1,
  pageSize = 10,
  total = 0,
  onPageChange = null,
  shallow = false,
  buttonMode = false,
  // Pass a boolean to switch the loading indicator on and off. Its slot is reserved even while
  // it is hidden, so toggling it never moves the pager; leave it undefined to opt out entirely.
  loading,
}) {
  const totalPages = Math.ceil(total / pageSize)
    ? Math.ceil(total / pageSize)
    : 1;

  const prevPage = Math.max(1, page - 1);
  const nextPage = Math.min(totalPages, page + 1);

  return (
    <Wrapper>
      <Nav disabled={page === 1}>
        <PageCaret
          shallow={shallow}
          isPre={true}
          page={prevPage}
          onPageChange={onPageChange}
          buttonMode={buttonMode}
        />
      </Nav>
      <Items
        shallow={shallow}
        page={page}
        total={totalPages}
        onPageChange={onPageChange}
        buttonMode={buttonMode}
      />
      <Nav disabled={page === totalPages}>
        <PageCaret
          shallow={shallow}
          isPre={false}
          page={nextPage}
          onPageChange={onPageChange}
          buttonMode={buttonMode}
        />
      </Nav>
      {!isNil(loading) && (
        <SystemLoading
          className={cn(
            "w-4 h-4 [&_path]:stroke-textDisabled",
            !loading && "invisible",
          )}
        />
      )}
    </Wrapper>
  );
}
