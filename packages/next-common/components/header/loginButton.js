import React, { memo } from "react";
import Button from "../button";
import Chains from "../../utils/consts/chains";

function LoginButton({ chain }) {
  let isPrimaryInverse = false;
  if ([Chains.kintsugi].includes(chain)) {
    isPrimaryInverse = true;
  }

  return (
    <Button
      primary={!isPrimaryInverse}
      primaryInverse={isPrimaryInverse}
      onClick={() => router.push("/login")}
    >
      Login
    </Button>
  );
}

export default memo(LoginButton);
