import React from "react";
import Button from "../button";
import { useRouter } from "next/router";
import getChainSettings from "../../utils/consts/settings";
import { withTheme } from "styled-components";

function LoginButton({ chain, theme }) {
  const router = useRouter();

  const setting = getChainSettings(chain);
  let isPrimaryInverse = setting.loginButtonPrimary;

  return (
    <Button
      primary={!isPrimaryInverse}
      primaryInverse={isPrimaryInverse || theme.isDark}
      onClick={() =>
        router.push({
          pathname: "/login",
          query: {
            redirect: router.asPath,
          },
        })
      }
    >
      Login
    </Button>
  );
}

export default withTheme(LoginButton);
