import React from "react";
import styled from "styled-components";
import Flex from "next-common/components/styled/flex";

const Wrapper = styled(Flex)`
  justify-content: center;
  border: 1px solid var(--neutral300);
  border-radius: 12px;
  padding: 24px;
  font-style: normal;
  font-weight: normal;
  font-size: 14px;
  text-align: center;
  background: var(--neutral100);
  color: var(--textTertiary);
`;

export function EmptyList({ type = "discussions" }) {
  return (
    <Wrapper className="shadow-100">
      <span>
        No current <span style={{ textTransform: "lowercase" }}>{type}</span>
      </span>
    </Wrapper>
  );
}

export default function MaybeEmpty({ items = [], type, children }) {
  if (items.length <= 0) {
    return <EmptyList type={type} />;
  }

  return children;
}
