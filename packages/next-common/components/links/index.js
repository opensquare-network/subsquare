import React from "react";
import styled from "styled-components";
import Flex from "../styled/flex";
import { useChain } from "../../context/chain";
import DotreasuryAccountLink from "./dotreasuryLink";
import SubScanLink, { SubScanAccountLink } from "./subscanLink";

const Wrapper = styled(Flex)`
  height: 20px;

  > :not(:first-child) {
    margin-left: 8px;
  }
`;

export default function ExtrinsicLinks({
                                indexer = "",
                                style = {},
                              }) {
  const chain = useChain();
  const supportedChains = [
    "karura",
    "acala",
    "khala",
    "basilisk",
    "acala",
    "kintsugi",
    "polkadex",
  ];
  if (!indexer && !address && supportedChains.includes(chain)) {
    return null;
  }

  return (
    <Wrapper style={style}>
      <SubScanLink indexer={indexer}/>
    </Wrapper>
  );
}


export function AccountLinks({
                               style = {},
                               address,
                             }) {
  const chain = useChain();
  const supportedChains = [
    "karura",
    "acala",
    "khala",
    "basilisk",
    "acala",
    "kintsugi",
    "polkadex",
  ];
  if (!address || supportedChains.includes(chain)) {
    return null;
  }

  return (
    <Wrapper style={style}>
      <SubScanAccountLink address={address}/>
      <DotreasuryAccountLink address={address}/>
    </Wrapper>
  );
}

