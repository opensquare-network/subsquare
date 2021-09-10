import styled from "styled-components";

const Wrapper = styled.div`
  height: 20px;
  display: flex;
  align-items: center;

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

const PolkassemblyLink = styled.a`
  width: 20px;
  height: 20px;
  background: url("/imgs/icons/link-polkassembly.svg");

  :hover {
    background: url("/imgs/icons/link-polkassembly-active.svg");
  }
`;

export default function Links({
  chain = "",
  indexer = "",
  style = {},
  address,
}) {
  if (chain === "karura") {
    return (
      <Wrapper style={style}>
        <SubscanLink
          href={
            address
              ? `https://${chain}.subscan.io/account/${address}`
              : `https://${chain}.subscan.io/extrinsic/${indexer.blockHeight}-${
                  indexer.extrinsicIndex ?? indexer.index
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
      <PolkascanLink
        href={
          address
            ? `https://polkascan.io/${chain}/account/${address}`
            : `https://polkascan.io/${chain}/extrinsic/${indexer.blockHeight}-${
                indexer.extrinsicIndex ?? indexer.index
              }`
        }
        target="_blank"
        rel="noreferrer"
      />
      <SubscanLink
        href={
          address
            ? `https://${chain}.subscan.io/account/${address}`
            : `https://${chain}.subscan.io/extrinsic/${indexer.blockHeight}-${
                indexer.extrinsicIndex ?? indexer.index
              }`
        }
        target="_blank"
        rel="noreferrer"
      />
    </Wrapper>
  );
}
