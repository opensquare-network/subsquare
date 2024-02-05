import React from "react";
import encodeUriQuery from "./encodeUriQuery";
import Link from "next/link";
import styled, { css } from "styled-components";
import { usePathname, useQuery } from "next-common/context/nav/route";

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

export default function PageItem({ page, now, onPageChange = null }) {
  const pathname = usePathname();
  const query = useQuery();

  return (
    <Link
      key={page}
      href={`${pathname}?${encodeUriQuery({
        ...query,
        page: page + 1,
      })}`}
      passHref
      legacyBehavior
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
