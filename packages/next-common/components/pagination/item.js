import React from "react";
import encodeUriQuery from "./encodeUriQuery";
import { useRouter } from "next/router";
import Link from "next/link";
import styled, { css } from "styled-components";

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

export default function PageItem({ page, now, onPageChange = null }) {
  const router = useRouter();

  return (
    <Link
      key={page}
      href={`${router.pathname}?${encodeUriQuery({
        ...router.query,
        page: page + 1,
      })}`}
      passHref
    >
      <Item
        active={now === page + 1}
        onClick={(e) => {
          onPageChange && onPageChange(e, page + 1);
        }}
      >
        {page + 1}
      </Item>
    </Link>
  );
}
