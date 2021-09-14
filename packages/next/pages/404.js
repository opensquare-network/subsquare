import styled from "styled-components";

const Wrapper = styled.div`
  height: 100vh;
  width: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
`;
const H1 = styled.h1`
  display: inline-block;
  border-right: 1px solid rgba(0, 0, 0, 0.3);
  margin: 0;
  margin-right: 20px;
  padding: 10px 23px 10px 0;
  font-size: 24px;
  font-weight: 500;
  vertical-align: top;
`;

const P = styled.p`
  font-size: 14px;
  font-weight: normal;
  line-height: inherit;
  margin: 0;
  padding: 0;

  a {
    color: #1f70c7;
  }
`;

export default function Custom404() {
  return (
    <Wrapper>
      <H1>404 </H1>
      <P>
        This page could not be found.
        <a href="/"> Back to Home.</a>
      </P>
    </Wrapper>
  );
}
