import React from "react";
import { useRouter } from "next/router";
import Link from "next/link";
import styled, { css } from "styled-components";

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
}) {
  const router = useRouter();
  const [url, query] = router.asPath.split("?");
  const urlParams = new URLSearchParams(query);
  urlParams.set("page", page);

  return (
    <Link
      shallow={shallow}
      scroll={!shallow}
      key={page}
      href={`${url}?${urlParams}`}
      passHref
    >
      <Item
        active={now === page}
        onClick={(e) => {
          onPageChange && onPageChange(e, page);
        }}
      >
        {page}
      </Item>
    </Link>
  );
}
