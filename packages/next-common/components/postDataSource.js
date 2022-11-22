import React from "react";
import styled from "styled-components";
import ExternalLinkIcon from "next-common/components/icons/externalLink";
import Chains from "../utils/consts/chains";
import { usePost, usePostType } from "../context/post";
import { useChain } from "../context/chain";
import { getPolkassemblyLink } from "next-common/utils/polkassembly";

const ExternalReference = styled.div`
  display: flex;
  align-items: center;
  padding: 12px;
  margin-top: 16px;
  gap: 8px;

  height: 41px;

  background: ${(props) => props.theme.grey100Bg};
  border-radius: 4px;

  span {
    font-style: normal;
    font-weight: 400;
    font-size: 12px;
    line-height: 140%;

    color: ${(props) => props.theme.textTertiary};
  }

  a {
    display: flex;
  }
`;

export default function PostDataSource() {
  const post = usePost();
  const type = usePostType();
  const chain = useChain();

  if (![Chains.kusama, Chains.polkadot].includes(chain)) {
    return null;
  }

  const paLink = getPolkassemblyLink(type, post);
  if (!paLink) {
    return null;
  }

  return (
    <ExternalReference>
      <span>Polkassembly</span>
      <a href={paLink} target="_blank">
        <ExternalLinkIcon color="#6848FF" />
      </a>
    </ExternalReference>
  );
}
