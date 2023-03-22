import React from "react";
import { useRouter } from "next/router";
import { withTheme } from "styled-components";
import { emptyFunction } from "../../utils";
import PrimaryButton from "../buttons/primaryButton";
import SecondaryButton from "../buttons/secondaryButton";

function LoginButton({ theme }) {
  const router = useRouter();

  const gotoLogin = () => {
    router
      .push({
        pathname: "/login",
        query: {
          redirect: router.asPath,
        },
      })
      .then(emptyFunction);
  };

  let TargetButton = SecondaryButton;
  if (theme.isDark) {
    TargetButton = PrimaryButton;
  }
  return <TargetButton onClick={gotoLogin}>Login</TargetButton>;
}

export default withTheme(LoginButton);
