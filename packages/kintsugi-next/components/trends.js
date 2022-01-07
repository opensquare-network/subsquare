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

export default function Trends({ user, chain }) {
  const router = useRouter();

  return (
    <Wrapper>
      <Title>Trends</Title>
      {user && (
        <Button primary isFill onClick={() => router.push(`/post/create`)}>
          New Post
        </Button>
      )}
      {!user && (
        <Button primary isFill onClick={() => router.push("/signup")}>
          Sign up
        </Button>
      )}
    </Wrapper>
  );
}
