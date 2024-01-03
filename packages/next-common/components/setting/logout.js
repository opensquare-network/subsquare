import React from "react";
import { useRouter } from "next/router";
import { ButtonWrapper } from "./styled";
import GhostButton from "../buttons/ghostButton";
import { useConnectedAccountContext } from "next-common/context/connectedAccount";
import { useIsKeyUser, useIsLoggedIn } from "next-common/context/user";

export default function Logout() {
  const router = useRouter();
  const { disconnect: disconnectAccount } = useConnectedAccountContext();
  const isLoggedIn = useIsLoggedIn();
  const isKeyUser = useIsKeyUser();

  return (
    <ButtonWrapper>
      <GhostButton
        className="!border-theme500 !text-theme500"
        onClick={async () => {
          await disconnectAccount();
          await router.replace("/");
        }}
      >
        {isKeyUser || !isLoggedIn ? "Disconnect wallet" : "Logout my account"}
      </GhostButton>
    </ButtonWrapper>
  );
}
