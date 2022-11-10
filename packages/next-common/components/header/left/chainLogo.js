import React from "react";
import Link from "next/link";
import useWindowSize from "../../../utils/hooks/useWindowSize";
import SubSquare from "../../../assets/header-logos/logo.svg";
import SubSquareDark from "../../../assets/header-logos/subsquare-dark.svg";
import { withTheme } from "styled-components";
import { useChainSettings } from "../../../context/chain";

function ChainLogo({ theme }) {
  const { width } = useWindowSize();
  const chainSetting = useChainSettings();
  const Element = chainSetting.headerLogo;
  let logo = <Element />;
  if (theme.isDark) {
    const DarkElement = chainSetting.darkHeaderLogo;
    logo = <DarkElement />;
  }

  if (width <= 768) {
    logo = theme.isDark ? <SubSquareDark /> : <SubSquare />;
  }

  return (
    <Link href="/">
      <a
        style={{
          height: 63,
          display: "inline-flex",
          alignItems: "center",
        }}
      >
        {logo}
      </a>
    </Link>
  );
}

export default withTheme(ChainLogo);
