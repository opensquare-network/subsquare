import React from "react";
import Link from "next/link";
import SubSquare from "../../../assets/header-logos/subsquare.svg";
import SubSquareMobile from "../../../assets/header-logos/subsquare-mobile.svg";
import SubSquareDark from "../../../assets/header-logos/subsquare-dark.svg";
import SubSquareMobileDark from "../../../assets/header-logos/subsquare-mobile-dark.svg";
import styled, { withTheme } from "styled-components";
import { useChainSettings } from "../../../context/chain";
import { useRouter } from "next/router";
import { flex, hidden } from "../../../styles/tailwindcss";
import { smcss } from "../../../utils/responsive";

const gov2Paths = ["/referenda", "/fellowship"];

const Wrapper = styled.div`
  ${flex};
`;

const Desktop = styled.div`
  ${flex};
  ${smcss(hidden)};
`;

const Mobile = styled.div`
  ${hidden};
  ${smcss(flex)};
`;

function useHeaderUrl() {
  const router = useRouter();
  const { pathname } = router;

  for (const path of gov2Paths) {
    if (pathname.startsWith(path)) {
      return path;
    }
  }

  return "/";
}

function ChainLogo({ theme }) {
  const chainSetting = useChainSettings();
  const headerUrl = useHeaderUrl();

  const Element = chainSetting.headerLogo ?? SubSquare;
  let logo = <Element />;
  let mobileLogo = <SubSquareMobile />;

  if (theme.isDark) {
    const DarkElement = chainSetting.darkHeaderLogo ?? SubSquareDark;
    logo = <DarkElement />;
    mobileLogo = <SubSquareMobileDark />;
  }

  return (
    <Wrapper>
      <Link
        href={headerUrl}
        style={{
          height: "100%",
          display: "flex",
        }}>

        <Desktop>{logo}</Desktop>
        <Mobile>{mobileLogo}</Mobile>

      </Link>
    </Wrapper>
  );
}

export default withTheme(ChainLogo);
