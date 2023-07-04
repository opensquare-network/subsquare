import React from "react";
import { useRouter } from "next/router";
import { ButtonWrapper } from "./styled";
import { logoutUser, useUserDispatch } from "../../context/user";
import ThemeGhostButton from "../buttons/themeGhostButton";

export default function Logout() {
  const router = useRouter();
  const userDispatch = useUserDispatch();

  return (
    <ButtonWrapper>
      <ThemeGhostButton
        isFill
        onClick={async () => {
          await logoutUser(userDispatch);
          await router.replace("/");
        }}
      >
        Logout my account
      </ThemeGhostButton>
    </ButtonWrapper>
  );
}
