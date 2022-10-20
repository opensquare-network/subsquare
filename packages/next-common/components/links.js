import React from "react";
import styled from "styled-components";
import Flex from "./styled/flex";
import LinkSubScanIcon from "../assets/imgs/icons/link-subscan.svg";
import LinkSubScanIconActive from "../assets/imgs/icons/link-subscan-active.svg";
import LinkDotreasuryIcon from "../assets/imgs/icons/link-dotreasury.svg";
import LinkDotreasuryIconActive from "../assets/imgs/icons/link-dotreasury-active.svg";
import { nodes } from "../utils/constants";

const Wrapper = styled(Flex)`
  height: 20px;

  > :not(:first-child) {
    margin-left: 8px;
  }
`;

const ThirdPartyLink = styled.a`
  width: 20px;
  height: 20px;
  overflow: hidden;
  svg:first-child {
    path:first-child {
      fill: ${(props) => props.theme.grey200Border};
    }
    path:last-child {
      fill: ${(props) => props.theme.grey400Border};
    }
  }
  &:hover {
    svg:first-child {
      display: none;
    }
    svg:last-child {
      path:first-child {
        fill: ${(props) => props.theme.grey200Border};
      }
    }
  }
`;

export default function Links({
  chain = "",
  indexer = "",
  style = {},
  address,
}) {
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
  let dotreasuryLink = null;
  const dotreasuryChains = ["kusama", "polkadot"];
  if(address && dotreasuryChains.includes(chain)){
    const chainSetting = nodes.find((node) => node.value === chain);
    dotreasuryLink =  <ThirdPartyLink
      href={`https://dotreasury.com/${chainSetting.symbol}/users/${address}`}
      target="_blank"
      rel="noreferrer"
    >
      <LinkDotreasuryIcon />
      <LinkDotreasuryIconActive />
    </ThirdPartyLink>;
  }

  return (
    <Wrapper style={style}>
      <ThirdPartyLink
        href={
          address
            ? `https://${chain}.subscan.io/account/${address}`
            : `https://${chain}.subscan.io/extrinsic/${indexer.blockHeight}-${
                indexer.extrinsicIndex ?? indexer.index ?? 0
              }`
        }
        target="_blank"
        rel="noreferrer"
      >
        <LinkSubScanIcon />
        <LinkSubScanIconActive />
      </ThirdPartyLink>
      {dotreasuryLink}
    </Wrapper>
  );
}
