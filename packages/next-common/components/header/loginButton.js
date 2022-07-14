import React, { memo } from "react";
import Button from "../button";
import { useRouter } from "next/router";
import getChainSettings from "../../utils/consts/settings";

function LoginButton({ chain }) {
  const router = useRouter();

  const setting = getChainSettings(chain);
  let isPrimaryInverse = setting.loginButtonPrimary;

  return (
    <Button
      primary={!isPrimaryInverse}
      primaryInverse={isPrimaryInverse}
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

export default memo(LoginButton);
