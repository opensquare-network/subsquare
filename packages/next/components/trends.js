import styled from "styled-components";
import Link from "next/link";

import Button from "./button";

const Wrapper = styled.div`
  > :not(:first-child) {
    margin-top: 16px;
  }
`;

const Title = styled.div`
  font-weight: bold;
  font-size: 16px;
`;

const SignUp = styled.div`
  background: #ffffff;
  border: 1px solid #ebeef4;
  border-radius: 4px;
  padding: 24px;
  display: flex;
  flex-direction: column;
  > :first-child {
    line-height: 150%;
    text-align: center;
    margin-bottom: 16px;
  }
`;

const Info = styled.div`
  background: #ebeef4;
  height: 144px;
  display: flex;
  align-items: center;
  justify-content: center;
`;

export default function Trends({ user }) {
  return (
    <Wrapper>
      <Title>Trends</Title>
      {user && (
        <Link href="/post/create">
          <Button primary isFill>
            New Post
          </Button>
        </Link>
      )}
      {!user && (
        <SignUp>
          <div>引导注册的文案</div>
          <Link href="/signup">
            <Button primary isFill>
              Sign up
            </Button>
          </Link>
        </SignUp>
      )}
      <Info>这里可以放一些次要信息</Info>
    </Wrapper>
  );
}
