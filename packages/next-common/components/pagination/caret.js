import React from "react";
import CaretLeft from "../../assets/imgs/icons/pager-caret-left.svg";
import CaretRight from "../../assets/imgs/icons/pager-caret-right.svg";
import Link from "next/link";
import styled from "styled-components";
import encodeUriQuery from "./encodeUriQuery";
import { usePathname, useQuery } from "next-common/context/nav/route";

const LinkInnerWrapper = styled.a`
  display: inline-flex;
  align-items: center;
`;

export default function PageCaret({ isPre = true, page, onPageChange = null }) {
  const pathname = usePathname();
  const query = useQuery();

  return (
    <Link
      href={`${pathname}?${encodeUriQuery({
        ...query,
        page,
      })}`}
      passHref
      legacyBehavior
    >
      <LinkInnerWrapper
        onClick={(e) => {
          onPageChange && onPageChange(e, page);
        }}
      >
        {isPre ? <CaretLeft /> : <CaretRight />}
      </LinkInnerWrapper>
    </Link>
  );
}
