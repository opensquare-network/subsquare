import React from "react";
import styled from "styled-components";
import { useRouter } from "next/router";
import GhostButton from "../buttons/ghostButton";
import SecondaryButton from "../buttons/secondaryButton";

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
      <GhostButton
        onClick={() =>
          router.push({
            pathname: "/login",
            query: {
              redirect: router.asPath,
            },
          })
        }
      >
        Login
      </GhostButton>
      <SecondaryButton onClick={() => router.push("/signup")}>
        Sign up
      </SecondaryButton>
    </Wrapper>
  );
}
