import React from "react";
import styled from "styled-components";

import ExternalLink from "next-common/components/externalLink";

const Wrapper = styled.div`
  background: var(--neutral200);
  border-radius: 4px;
  padding: 12px 16px;
  color: var(--textSecondary);
  font-size: 14px;
  line-height: 140%;
`;

export default function DownloadExtension() {
  return (
    <Wrapper>
      Polkadot-js extension not detected. No web3 account could be found. Visit
      this page on a computer with polkadot-js extension.
      <ExternalLink href="https://polkadot.js.org/extension/">
        {"Download Polkadot{.js} extension"}
      </ExternalLink>
    </Wrapper>
  );
}
