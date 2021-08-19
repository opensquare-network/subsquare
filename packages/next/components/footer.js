import styled from "styled-components";

const Wrapper = styled.footer`
  height: 55px;
  border-top: 1px solid #e0e4eb;
  display: flex;
  align-items: center;
  justify-content: center;
  color: #9da9bb;
  font-size: 12px;
  > img {
    margin-left: 8px;
  }
`;

export default function Footer() {
  return (
    <Wrapper>
      <div>{`© ${new Date().getFullYear()} SubSquare Powered by`}</div>
      <img src="/imgs/logo-opensquare.svg" />
    </Wrapper>
  );
}
