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

  if (theme.isDark) {
    return <PrimaryButton onClick={gotoLogin}>Login</PrimaryButton>;
  }

  return <SecondaryButton onClick={gotoLogin}>Login</SecondaryButton>;
}

export default withTheme(LoginButton);
