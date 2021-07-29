import styled from "styled-components";

const Wrapper = styled.footer`
  @media screen and (max-width: 600px) {
    display: none;
  }
`;

const Divider = styled.div`
  background: #e0e4eb;
  height: 1px;
  margin-bottom: 24px;
`;

const Text = styled.div`
  color: #9da9bb;
  font-size: 12px;
  margin-bottom: 8px;
`;

export default function Footer() {
  return (
    <Wrapper>
      <Divider />
      <Text>{`© ${new Date().getFullYear()} SubSquare Powered by`}</Text>
      <img src="/imgs/logo-opensquare.svg" />
    </Wrapper>
  );
}
