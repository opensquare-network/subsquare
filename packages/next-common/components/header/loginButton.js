import React from "react";
import { useRouter } from "next/router";
import getChainSettings from "../../utils/consts/settings";
import { withTheme } from "styled-components";
import { emptyFunction } from "../../utils";
import PrimaryButton from "../buttons/primaryButton";
import GhostButton from "../buttons/ghostButton";

function LoginButton({ chain, theme }) {
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

  const setting = getChainSettings(chain);
  let isPrimaryInverse = setting.loginButtonPrimary;

  let TargetButton = GhostButton;
  if (isPrimaryInverse || theme.isDark) {
    TargetButton = PrimaryButton;
  }
  return <TargetButton onClick={gotoLogin}>Connect</TargetButton>;
}

export default withTheme(LoginButton);
