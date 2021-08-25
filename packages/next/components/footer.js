import styled from "styled-components";

const Wrapper = styled.footer`
  color: #9da9bb;
  font-size: 12px;
  margin-bottom: 32px;
  > svg {
    margin-bottom: 24px;
  }
  > img {
    margin-top: 8px;
  }
`;

export default function Footer() {
  return (
    <Wrapper className="footer">
      <svg
        xmlns="http://www.w3.org/2000/svg"
        width="80"
        height="1"
        viewBox="0 0 80 1"
        fill="none"
      >
        <rect width="80" height="1" fill="#E0E4EB" />
      </svg>
      <div>{`© ${new Date().getFullYear()} SubSquare · Powered by`}</div>
      <img src="/imgs/logo-opensquare.svg" />
    </Wrapper>
  );
}
