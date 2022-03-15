import React from "react";
import styled from "styled-components";
import Flex from "./styled/flex";

const Wrapper = styled(Flex)`
  height: 20px;

  > :not(:first-child) {
    margin-left: 8px;
  }
`;

const SubscanLink = styled.a`
  width: 20px;
  height: 20px;
  background: url("/imgs/icons/link-subscan.svg");

  :hover {
    background: url("/imgs/icons/link-subscan-active.svg");
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
      />
    </Wrapper>
  );
}
