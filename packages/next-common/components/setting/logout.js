import React from "react";
import { useRouter } from "next/router";
import { ButtonWrapper } from "./styled";
import GhostButton from "../buttons/ghostButton";
import { useConnectedAccountContext } from "next-common/context/connectedAccount";
import { useIsLoggedIn, useUser } from "next-common/context/user";
import { isKeyRegisteredUser } from "next-common/utils";

export default function Logout() {
  const router = useRouter();
  const { disconnect: disconnectAccount } = useConnectedAccountContext();
  const isLoggedIn = useIsLoggedIn();
  const user = useUser();
  const isKeyUser = isKeyRegisteredUser(user);

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
