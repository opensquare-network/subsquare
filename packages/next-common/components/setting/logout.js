import React from "react";
import { useRouter } from "next/router";
import { ButtonWrapper } from "./styled";
import GhostButton from "../buttons/ghostButton";
import { useConnectedWalletContext } from "next-common/context/connectedWallet";

export default function Logout() {
  const router = useRouter();
  const { disconnect: disconnectWallet } = useConnectedWalletContext();

  return (
    <ButtonWrapper>
      <GhostButton
        className="!border-theme500 !text-theme500"
        onClick={async () => {
          await disconnectWallet();
          await router.replace("/");
        }}
      >
        Logout my account
      </GhostButton>
    </ButtonWrapper>
  );
}
