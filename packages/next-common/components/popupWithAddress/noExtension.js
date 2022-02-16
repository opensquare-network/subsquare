import React from "react";
import styled from "styled-components";
import { Message } from "./styled";
import ExternalLink from "../externalLink";

const Download = styled.div`
  color: #2196f3;
`;

export default function NoExtension() {
  return (
    <Message>
      <span>
        Polkadot-js extension not detected. No web3 account could be found.
        Visit this page on a computer with polkadot-js extension.
      </span>
      <ExternalLink href="https://polkadot.js.org/extension/">
        <Download>{"Download Polkadot{.js} extension"}</Download>
      </ExternalLink>
    </Message>
  );
}
