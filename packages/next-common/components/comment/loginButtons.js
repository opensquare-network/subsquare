import React from "react";
import styled from "styled-components";
import { useRouter } from "next/router";
import Button from "next-common/components/button";

const Wrapper = styled.div`
  margin-top: 48px;
  display: flex;
  justify-content: flex-end;
  > :not(:first-child) {
    margin-left: 12px;
  }
`;

export default function LoginButtons() {
  const router = useRouter();

  return (
    <Wrapper>
      <Button onClick={() => router.push("/login")}>Login</Button>
      <Button onClick={() => router.push("/signup")} secondary>
        Sign up
      </Button>
    </Wrapper>
  );
}
