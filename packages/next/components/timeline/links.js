import styled from "styled-components";
import Flex from "next-common/components/styled/flex";

const Wrapper = styled(Flex)`
  height: 20px;

  > :not(:first-child) {
    margin-left: 8px;
  }
`;

const PolkascanLink = styled.a`
  width: 20px;
  height: 20px;
  background: url("/imgs/icons/link-polkascan.svg");

  :hover {
    background: url("/imgs/icons/link-polkascan-active.svg");
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
  if (!indexer && !address) {
    return null;
  }
  if (chain === "karura" || chain === "khala" || chain === "basilisk") {
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
