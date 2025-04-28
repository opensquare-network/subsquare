import React from "react";
import { useRouter } from "next/router";
import CaretLeft from "../../assets/imgs/icons/pager-caret-left.svg";
import CaretRight from "../../assets/imgs/icons/pager-caret-right.svg";
import Link from "next/link";
import styled from "styled-components";

const LinkInnerWrapper = styled.span`
  display: inline-flex;
  align-items: center;
`;

export default function PageCaret({
  isPre = true,
  page,
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
      href={`${url}?${urlParams}`}
      passHref
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
