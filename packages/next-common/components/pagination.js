import React from "react";
import styled, { css } from "styled-components";
import Link from "next/link";
import { useRouter } from "next/router";
import CaretLeft from "../assets/imgs/icons/pager-caret-left.svg";
import CaretRight from "../assets/imgs/icons/pager-caret-right.svg";

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

const Item = styled.a`
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
  color: ${(props) => props.theme.textSecondary};

  :hover {
    background: ${(props) => props.theme.grey200Border};
  }

  ${(p) =>
    p.active &&
    css`
      background: ${(props) => props.theme.grey200Border};
      color: ${(props) => props.theme.textPrimary};
      cursor: auto;
      pointer-events: none;
    `}
`;

const Ellipsis = styled.div`
  font-size: 14px;
  font-weight: 500;
  color: ${(props) => props.theme.textSecondary};

  & + & {
    display: none;
  }
`;
const PAGE_OFFSET = 1;
const encodeURIQuery = (q) =>
  Object.keys(q)
    .map((k) => `${k}=${encodeURIComponent(q[k])}`)
    .join("&");

export default function Pagination({ page, pageSize, total }) {
  const router = useRouter();
  const totalPages = Math.ceil(total / pageSize)
    ? Math.ceil(total / pageSize)
    : 1;

  const prevPage = Math.max(1, page + 1 - 1 - PAGE_OFFSET);
  const nextPage = Math.min(totalPages, page + 1 + 1 - PAGE_OFFSET);

  return (
    <Wrapper>
      <Nav disabled={page === 1}>
        <Link
          href={`${router.pathname}?${encodeURIQuery({
            ...router.query,
            page: prevPage,
          })}`}
          passHref
        >
          <CaretLeft />
        </Link>
      </Nav>
      {Array.from(Array(totalPages)).map((_, index) =>
        index + 1 > 2 &&
        index + 1 < totalPages - 1 &&
        Math.abs(index + 1 - page) >= 2 ? (
          <Ellipsis key={index}>...</Ellipsis>
        ) : (
          <Link
            key={index}
            href={`${router.pathname}?${encodeURIQuery({
              ...router.query,
              page: index + 1 + 1 - PAGE_OFFSET,
            })}`}
            passHref
          >
            <Item active={page === index + 1}>{index + 1}</Item>
          </Link>
        )
      )}
      <Nav disabled={page === totalPages}>
        <Link
          href={`${router.pathname}?${encodeURIQuery({
            ...router.query,
            page: nextPage,
          })}`}
          passHref
        >
          <CaretRight />
        </Link>
      </Nav>
    </Wrapper>
  );
}
