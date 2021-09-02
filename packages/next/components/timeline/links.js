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

export default function Links({
                                chain ='',
                                address = '',
                                style = {},
                              }) {
  if(chain === "karura"){
    return (
      <Wrapper style={style}>
        <SubscanLink href={`https://${chain}.subscan.io/account/${address}`} target="_blank" rel="noreferrer"/>
      </Wrapper>
    );
  }
  return (
    <Wrapper style={style}>
      <PolkascanLink href={`https://polkascan.io/kusama/account/${address}`} target="_blank" rel="noreferrer"/>
      <SubscanLink href={`https://${chain}.subscan.io/account/${address}`} target="_blank" rel="noreferrer"/>
    </Wrapper>
  );
}
