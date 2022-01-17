import React from "react";
import styled from "styled-components";

import ExternalLink from "next-common/components/externalLink";

const Wrapper = styled.div`
  background: #f6f7fa;
  border-radius: 4px;
  padding: 12px 16px;
  color: #506176;
  font-size: 14px;
  line-height: 140%;
`;

const StyledLink = styled.div`
  cursor: pointer;
  text-decoration: underline;
  color: #2196f3;
`;

export default function DownloadExtension() {
  return (
    <Wrapper>
      Polkadot-js extension not detected. No web3 account could be found. Visit
      this page on a computer with polkadot-js extension.
      <ExternalLink href="https://polkadot.js.org/extension/">
        <StyledLink>{"Download Polkadot{.js} extension"}</StyledLink>
      </ExternalLink>
    </Wrapper>
  );
}
