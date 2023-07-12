import React from "react";
import styled from "styled-components";
import ExternalLinkIcon from "next-common/components/icons/externalLink";
import Chains from "../utils/consts/chains";
import { usePost } from "../context/post";
import { useChain } from "../context/chain";
import { getPolkassemblyLink } from "next-common/utils/polkassembly";
import { useDetailType } from "../context/page";
import { GreyPanel } from "./styled/containers/greyPanel";

const ExternalReference = styled(GreyPanel)`
  padding: 12px;
  margin-top: 16px;
  gap: 8px;

  height: 41px;

  span {
    font-style: normal;
    font-weight: 400;
    font-size: 12px;
    line-height: 140%;

    color: var(--textTertiary);
  }

  a {
    display: flex;
  }
`;

export default function PostDataSource() {
  const post = usePost();
  const type = useDetailType();
  const chain = useChain();

  if (![Chains.kusama, Chains.polkadot, Chains.collectives].includes(chain)) {
    return null;
  }

  const paLink = getPolkassemblyLink(type, post);
  if (!paLink) {
    return null;
  }

  return (
    <ExternalReference>
      <span>Polkassembly</span>
      <a href={paLink} target="_blank" rel="noreferrer">
        <ExternalLinkIcon color="#6848FF" />
      </a>
    </ExternalReference>
  );
}
