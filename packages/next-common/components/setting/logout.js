import React from "react";
import { useRouter } from "next/router";
import { ButtonWrapper, Label } from "./styled";
import GhostButton from "../buttons/ghostButton";
import { logoutUser, useUserDispatch } from "../../context/user";

export default function Logout() {
  const router = useRouter();
  const userDispatch = useUserDispatch();

  return (
    <div>
      <Label>Logout</Label>
      <ButtonWrapper>
        <GhostButton
          isFill
          onClick={async () => {
            await logoutUser(userDispatch);
            await router.replace("/");
          }}
        >
          Logout my account
        </GhostButton>
      </ButtonWrapper>
    </div>
  );
}
