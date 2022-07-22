import React from "react";
import styled from "styled-components";
import Button from "next-common/components/button";

const Wrapper = styled.div`
  margin-top: 48px;
  display: flex;
  justify-content: flex-end;
  > :not(:first-child) {
    margin-left: 12px;
  }
`;

export default function PolkassemblyCommentButton({ chain, paId, type }) {
  let link = `https://${chain}.polkassembly.io/post/${paId}`;
  return (
    <Wrapper>
      <a href={link} target="_blank" rel="noreferrer">
        <Button secondary>
          Comment on Polkassembly
        </Button>
      </a>
    </Wrapper>
  );
}
