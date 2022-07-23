import React, { memo } from "react";
import Link from "next/link";
import Chains from "../../../utils/consts/chains";
import useWindowSize from "../../../utils/hooks/useWindowSize";
import Kusama from "../../../assets/header-logos/kusama.svg";
import Polkadot from "../../../assets/header-logos/polkadot.svg";
import Turing from "../../../assets/header-logos/turing.png";
import Kintsugi from "../../../assets/header-logos/kintsugi.svg";
import Interlay from "../../../assets/header-logos/interlay.svg";
import Crust from "../../../assets/header-logos/crust.svg";
import Crab from "../../../assets/header-logos/crab.svg";
import Karura from "../../../assets/header-logos/karura.svg";
import Khala from "../../../assets/header-logos/khala.svg";
import Phala from "../../../assets/header-logos/phala.svg";
import Acala from "../../../assets/header-logos/acala.svg";
import Bifrost from "../../../assets/header-logos/bifrost.svg";
import Calamari from "../../../assets/header-logos/calamari.svg";
import Polkadex from "../../../assets/header-logos/polkadex.svg";
import Centrifuge from "../../../assets/header-logos/centrifuge.svg";
import Litmus from "../../../assets/header-logos/litmus.svg";
import SubSquare from "../../../assets/header-logos/logo.svg";

function ChainLogo({ chain }) {
  let logo = <SubSquare />;
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
    } else if (Chains.phala === chain) {
      logo = <Phala />;
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
      logo = (
        <img width={240} height={64} src={Turing.src} alt="" className="logo" />
      );
    } else if (Chains.crab === chain) {
      logo = <Crab />;
    } else if (Chains.polkadex === chain) {
      logo = <Polkadex />;
    } else if (Chains.centrifuge === chain) {
      logo = <Centrifuge />;
    } else if (Chains.litmus === chain) {
      logo = <Litmus />;
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
