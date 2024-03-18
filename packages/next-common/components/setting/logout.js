import React from "react";
import { useRouter } from "next/router";
import { ButtonWrapper } from "./styled";
import SecondaryButton from "next-common/lib/button/secondary";
import { useConnectedAccountContext } from "next-common/context/connectedAccount";
import { useIsWeb3User, useIsLoggedIn } from "next-common/context/user";

export default function Logout() {
  const router = useRouter();
  const { disconnect: disconnectAccount } = useConnectedAccountContext();
  const isLoggedIn = useIsLoggedIn();
  const isWeb3User = useIsWeb3User();

  return (
    <ButtonWrapper>
      <SecondaryButton
        className="!border-theme500 !text-theme500"
        onClick={async () => {
          await disconnectAccount();
          await router.replace("/");
        }}
      >
        {isWeb3User || !isLoggedIn ? "Disconnect wallet" : "Logout my account"}
      </SecondaryButton>
    </ButtonWrapper>
  );
}
