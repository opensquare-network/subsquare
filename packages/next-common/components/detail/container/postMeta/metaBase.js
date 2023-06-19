import styled from "styled-components";
import Flex from "../../../styled/flex";
import { smcss } from "../../../../utils/responsive";
import { hidden, inline_flex, items_center } from "../../../../styles/tailwindcss";
import User from "../../../user";
import React from "react";
import { usePost } from "../../../../context/post";

const FlexWrapper = styled(Flex)`
  justify-content: space-between;
  flex-wrap: nowrap;
`;

const DividerWrapper = styled(Flex)`
  flex-wrap: wrap;

  > :not(:first-child) {
    ${ smcss(hidden) };
    ${ inline_flex };
    ${ items_center };

    ::before {
      content: "·";
      font-size: 12px;
      color: var(--textTertiary);
      margin: 0 8px;
    }
  }
`;

export default function PostMetaBase({ children, state }) {
  const post = usePost();

  return <FlexWrapper>
    <DividerWrapper>
      <User
        user={post.author}
        add={post.proposer || post.finder}
        fontSize={12}
      />
      { children }
    </DividerWrapper>
    { state }
  </FlexWrapper>;
}
