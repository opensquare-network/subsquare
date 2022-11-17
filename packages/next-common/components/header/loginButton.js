import React from "react";
import { useRouter } from "next/router";
import getChainSettings from "../../utils/consts/settings";
import { withTheme } from "styled-components";
import { emptyFunction } from "../../utils";
import PrimaryButton from "../buttons/primaryButton";
import SecondaryButton from "../buttons/secondaryButton";
import { useChainSettings } from "../../context/chain";

function LoginButton({ theme }) {
  const router = useRouter();
  const setting = useChainSettings();

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

  let isPrimaryInverse = setting.loginButtonPrimary;

  let TargetButton = SecondaryButton;
  if (isPrimaryInverse || theme.isDark) {
    TargetButton = PrimaryButton;
  }
  return <TargetButton onClick={gotoLogin}>Login</TargetButton>;
}

export default withTheme(LoginButton);
