import React from "react";
import { useRouter } from "next/router";
import { ButtonWrapper } from "./styled";
import { logoutUser, useUserDispatch } from "../../context/user";
import GhostButton from "../buttons/ghostButton";

export default function Logout() {
  const router = useRouter();
  const userDispatch = useUserDispatch();

  return (
    <ButtonWrapper>
      <GhostButton
        className="!border-theme500 !text-theme500"
        onClick={async () => {
          await logoutUser(userDispatch);
          await router.replace("/");
        }}
      >
        Logout my account
      </GhostButton>
    </ButtonWrapper>
  );
}
