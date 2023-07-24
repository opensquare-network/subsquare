import React from "react";
import { useRouter } from "next/router";
import { withTheme } from "styled-components";
import { emptyFunction } from "../../utils";
import PrimaryButton from "../buttons/primaryButton";

function LoginButton() {
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

  return <PrimaryButton onClick={gotoLogin}>Login</PrimaryButton>;
}

export default withTheme(LoginButton);
