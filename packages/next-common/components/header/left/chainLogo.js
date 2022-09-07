import React from "react";
import Link from "next/link";
import useWindowSize from "../../../utils/hooks/useWindowSize";
import SubSquare from "../../../assets/header-logos/logo.svg";
import SubSquareDark from "../../../assets/header-logos/subsquare-dark.svg";
import { withTheme } from "styled-components";
import getChainSettings from "../../../utils/consts/settings";

function ChainLogo({ chain, theme }) {
  const { width } = useWindowSize();
  const chainSetting = getChainSettings(chain);
  if (!chainSetting) {
    throw new Error(`Unsupported chain in ChainLogo: ${process.env.CHAIN}`);
  }
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
