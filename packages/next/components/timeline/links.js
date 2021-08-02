import styled from "styled-components";

const Wrapper = styled.div`
  height: 28px;
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

export default function Links() {
  return (
    <Wrapper>
      <PolkascanLink href="/" />
      <SubscanLink href="/" />
      <PolkassemblyLink href="/" />
    </Wrapper>
  );
}
