import React from "react";
import { useRouter } from "next/router";
import CaretLeft from "../../assets/imgs/icons/pager-caret-left.svg";
import CaretRight from "../../assets/imgs/icons/pager-caret-right.svg";
import Link from "next/link";
import styled from "styled-components";
import encodeUriQuery from "./encodeUriQuery";

const LinkInnerWrapper = styled.a`
  display: inline-flex;
  align-items: center;
`;

export default function PageCaret({ isPre = true, page }) {
  const router = useRouter();

  return (
    <Link
      href={`${router.pathname}?${encodeUriQuery({
        ...router.query,
        page,
      })}`}
      passHref
    >
      <LinkInnerWrapper>
        {isPre ? <CaretLeft /> : <CaretRight />}
      </LinkInnerWrapper>
    </Link>
  );
}
