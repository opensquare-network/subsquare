import React from "react";
import styled from "styled-components";
import Flex from "../styled/flex";
import LinkSubScanIcon from "../../assets/imgs/icons/link-subscan.svg";
import LinkSubScanIconActive from "../../assets/imgs/icons/link-subscan-active.svg";
import { useChain } from "../../context/chain";
import ThirdPartyLink from "./thirdPartyLink";
import DotreasuryLink from "./dotreasuryLink";
import SubScanLink from "./subscanLink";

const Wrapper = styled(Flex)`
  height: 20px;

  > :not(:first-child) {
    margin-left: 8px;
  }
`;

export default function Links({
                                indexer = "",
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
  if (!indexer && !address && supportedChains.includes(chain)) {
    return null;
  }

  return (
    <Wrapper style={style}>
      <SubScanLink address={address} indexer={indexer}/>
      <DotreasuryLink address={address}/>
    </Wrapper>
  );
}
