import React, { memo } from "react";
import Button from "../button";
import Chains from "../../utils/consts/chains";
import { useRouter } from "next/router";

function LoginButton({ chain }) {
  const router = useRouter();

  let isPrimaryInverse = false;
  if (
    [
      Chains.kintsugi,
      Chains.khala,
      Chains.phala,
      Chains.bifrost,
      Chains.calamari,
      Chains.kusama,
    ].includes(chain)
  ) {
    isPrimaryInverse = true;
  }

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
