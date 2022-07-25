import React from "react";
import Link from "next/link";
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
import Phala from "../../../assets/header-logos/phala.svg";
import Acala from "../../../assets/header-logos/acala.svg";
import Bifrost from "../../../assets/header-logos/bifrost.svg";
import Calamari from "../../../assets/header-logos/calamari.svg";
import Polkadex from "../../../assets/header-logos/polkadex.svg";
import Centrifuge from "../../../assets/header-logos/centrifuge.svg";
import Litmus from "../../../assets/header-logos/litmus.svg";
import SubSquare from "../../../assets/header-logos/logo.svg";
import KusamaDark from "../../../assets/header-logos/kusama-dark.svg";
import PolkadotDark from "../../../assets/header-logos/polkadot-dark.svg";
import TuringDark from "../../../assets/header-logos/turing-dark.svg";
import KintsugiDark from "../../../assets/header-logos/kintsugi-dark.svg";
import InterlayDark from "../../../assets/header-logos/interlay-dark.svg";
import CrustDark from "../../../assets/header-logos/crust-dark.svg";
import CrabDark from "../../../assets/header-logos/crab-dark.svg";
import KaruraDark from "../../../assets/header-logos/karura-dark.svg";
import KhalaDark from "../../../assets/header-logos/khala-dark.svg";
import PhalaDark from "../../../assets/header-logos/phala-dark.svg";
import AcalaDark from "../../../assets/header-logos/acala-dark.svg";
import BifrostDark from "../../../assets/header-logos/bifrost-dark.svg";
import CalamariDark from "../../../assets/header-logos/calamari-dark.svg";
import PolkadexDark from "../../../assets/header-logos/polkadex-dark.svg";
import CentrifugeDark from "../../../assets/header-logos/centrifuge-dark.svg";
import { withTheme } from "styled-components";

function ChainLogo({ chain, theme }) {
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
      logo = <Turing />;
    } else if (Chains.crab === chain) {
      logo = <Crab />;
    } else if (Chains.polkadex === chain) {
      logo = <Polkadex />;
    } else if (Chains.centrifuge === chain) {
      logo = <Centrifuge />;
    } else if (Chains.litmus === chain) {
      logo = <Litmus />;
    }
    if (theme.isDark) {
      if (Chains.kintsugi === chain) {
        logo = <KintsugiDark />;
      } else if (Chains.interlay === chain) {
        logo = <InterlayDark />;
      } else if (Chains.acala === chain) {
        logo = <AcalaDark />;
      } else if (Chains.karura === chain) {
        logo = <KaruraDark />;
      } else if (Chains.phala === chain) {
        logo = <PhalaDark />;
      } else if (Chains.khala === chain) {
        logo = <KhalaDark />;
      } else if (Chains.bifrost === chain) {
        logo = <BifrostDark />;
      } else if (Chains.crust === chain) {
        logo = <CrustDark />;
      } else if (Chains.calamari === chain) {
        logo = <CalamariDark />;
      } else if (Chains.kusama === chain) {
        logo = <KusamaDark />;
      } else if (Chains.polkadot === chain) {
        logo = <PolkadotDark />;
      } else if (Chains.turing === chain) {
        logo = <TuringDark />;
      } else if (Chains.crab === chain) {
        logo = <CrabDark />;
      } else if (Chains.polkadex === chain) {
        logo = <PolkadexDark />;
      } else if (Chains.centrifuge === chain) {
        logo = <CentrifugeDark />;
      }
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

export default withTheme(ChainLogo);
