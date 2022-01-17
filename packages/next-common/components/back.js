import React from "react";
import styled from "styled-components";
import Link from "next/link";
import Flex from "./styled/flex";

const Wrapper = styled(Flex)`
  font-size: 16px;
  font-weight: bold;
  cursor: pointer;

  > img {
    width: 14px;
    height: 14px;
    margin-right: 12px;
  }

  @media screen and (max-width: 768px) {
    margin-left: 16px;
  }
`;

export default function Back({ href, text }) {
  return (
    <Link href={href} passHref>
      <Wrapper>
        <img alt="" src="/imgs/icons/arrow-left.svg" width={16} height={16} />
        <div>{text}</div>
      </Wrapper>
    </Link>
  );
}
