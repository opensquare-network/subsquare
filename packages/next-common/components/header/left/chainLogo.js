import React, { memo } from "react";
import Link from "next/link";
import styled from "styled-components";
import Chains from "../../../utils/consts/chains";
import useWindowSize from "../../../utils/hooks/useWindowSize";
import Kusama from "../../../assets/header-logos/kusama.svg";
import Polkadot from "../../../assets/header-logos/polkadot.svg";
import Turing from "../../../assets/header-logos/turing.svg";
import Kintsugi from "../../../assets/header-logos/kintsugi.svg";
import Interlay from "../../../assets/header-logos/interlay.svg";
import Crust from "../../../assets/header-logos/crust.svg";
import Crab from "../../../assets/header-logos/crab.svg";
import Karura from "../../../assets/header-logos/karura.svg";
import Khala from "../../../assets/header-logos/khala.svg";
import Acala from "../../../assets/header-logos/acala.svg";
import Bifrost from "../../../assets/header-logos/bifrost.svg";
import Calamari from "../../../assets/header-logos/calamari.svg";
import Polkadex from "../../../assets/header-logos/polkadex.svg";
import Centrifuge from "../../../assets/header-logos/centrifuge.svg";

const Logo = styled.img`
  cursor: pointer;
`;

const LogoImg = styled(Logo)`
  width: 161px;
  height: 64px;
`;

function ChainLogo({ chain }) {
  let logo = <LogoImg src="/imgs/logo.svg" alt="" />;
  const { width } = useWindowSize();

  if (width > 768) {
    if (Chains.kintsugi === chain) {
      logo = <Kintsugi />;
    } else if (Chains.interlay === chain) {
      logo = <Interlay />;
    } else if (Chains.acala === chain) {
      logo = <Acala />;
    } else if (Chains.karura === chain) {
      logo = <Karura />;
    } else if (Chains.khala === chain) {
      logo = <Khala />;
    } else if (Chains.bifrost === chain) {
      logo = <Bifrost />;
    } else if (Chains.crust === chain) {
      logo = <Crust />;
    } else if (Chains.calamari === chain) {
      logo = <Calamari />;
    } else if (Chains.kusama === chain) {
      logo = <Kusama />;
    } else if (Chains.polkadot === chain) {
      logo = <Polkadot />;
    } else if (Chains.turing === chain) {
      logo = <Turing />;
    } else if (Chains.crab === chain) {
      logo = <Crab />;
    } else if (Chains.polkadex === chain) {
      logo = <Polkadex />;
    } else if (Chains.centrifuge === chain) {
      logo = <Centrifuge />;
    }
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

export default memo(ChainLogo);
