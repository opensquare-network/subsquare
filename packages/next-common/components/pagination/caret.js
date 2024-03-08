import React from "react";
import { useRouter } from "next/router";
import CaretLeft from "../../assets/imgs/icons/pager-caret-left.svg";
import CaretRight from "../../assets/imgs/icons/pager-caret-right.svg";
import Link from "next/link";
import styled from "styled-components";

const LinkInnerWrapper = styled.a`
  display: inline-flex;
  align-items: center;
`;

export default function PageCaret({ isPre = true, page, onPageChange = null }) {
  const router = useRouter();
  const [url, query] = router.asPath.split("?");
  const urlParams = new URLSearchParams(query);
  urlParams.set("page", page);

  return (
    <Link href={`${url}?${urlParams}`} passHref legacyBehavior>
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
