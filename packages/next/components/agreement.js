import styled from "styled-components";

const Wrapper = styled.div`
  color: #9da9bb;
  text-align: center;
  margin-top: 24px;
  > :not(:first-child) {
    margin-top: 8px;
  }
  a {
    color: #1e2134;
    cursor: pointer;
  }
`;

export default function Agreement() {
  return (
    <Wrapper>
      <div>By logging in or sign up, you agree to the updated</div>
      <div>
        <a>Terms of Service</a> and <a>Privacy Policy</a>
      </div>
    </Wrapper>
  );
}
