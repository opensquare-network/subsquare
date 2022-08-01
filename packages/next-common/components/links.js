import React from "react";
import styled from "styled-components";
import Flex from "./styled/flex";
import LinkSubScanIcon from "../assets/imgs/icons/link-subscan.svg";
import LinkSubScanIconActive from "../assets/imgs/icons/link-subscan-active.svg";

const Wrapper = styled(Flex)`
  height: 20px;

  > :not(:first-child) {
    margin-left: 8px;
  }
`;

const SubscanLink = styled.a`
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

  return (
    <Wrapper style={style}>
      <SubscanLink
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
      </SubscanLink>
    </Wrapper>
  );
}
