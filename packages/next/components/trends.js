import styled from "styled-components";
import { useRouter } from "next/router";

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
  border-radius: 6px;
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
  border-radius: 6px;
`;

export default function Trends({ chain, user }) {
  const router = useRouter();

  return (
    <Wrapper>
      <Title>Trends</Title>
      {user && (
        <Button primary isFill onClick={() => router.push(`/${chain}/post/create`)}>
          New Post
        </Button>
      )}
      {!user && (
        <SignUp>
          <div>引导注册的文案</div>
          <Button primary isFill onClick={() => router.push("/signup")}>
            Sign up
          </Button>
        </SignUp>
      )}
      <Info>这里可以放一些次要信息</Info>
    </Wrapper>
  );
}
