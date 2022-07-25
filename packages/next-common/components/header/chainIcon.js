import React from "react";
import Chains from "../../utils/consts/chains";
import Kusama from "../../assets/icons/chain/kusama.png";
import Polkadot from "../../assets/icons/chain/polkadot.png";
import Acala from "../../assets/icons/chain/acala.png";
import Bifrost from "../../assets/icons/chain/bifrost.png";
import Calamari from "../../assets/icons/chain/calamari.png";
import Crab from "../../assets/icons/chain/crab.png";
import Crust from "../../assets/icons/chain/crust.png";
import Interlay from "../../assets/icons/chain/interlay.png";
import Kabocha from "../../assets/icons/chain/kabocha.png";
import Karura from "../../assets/icons/chain/karura.png";
import Khala from "../../assets/icons/chain/khala.png";
import Phala from "../../assets/icons/chain/phala.png";
import Polkadex from "../../assets/icons/chain/polkadex.png";
import Turing from "../../assets/icons/chain/turing.png";
import Kintsugi from "../../assets/icons/chain/kintsugi.png";
import Centrifuge from "../../assets/icons/chain/centrifuge.png";
import CrustDark from "../../assets/icons/chain/crust-dark.png";
import CentrifugeDark from "../../assets/icons/chain/centrifuge-dark.png";
import InterlayDark from "../../assets/icons/chain/interlay-dark.png";
import KusamaDark from "../../assets/icons/chain/kusama-dark.png";
import PolkadexDark from "../../assets/icons/chain/polkadex-dark.png";
import useDarkMode from "../../utils/hooks/useDarkMode";
import Litmus from "../../assets/icons/chain/litmus.png";
import { withTheme } from "styled-components";

const imageMap = {
  [Chains.kusama]: Kusama,
  [Chains.polkadot]: Polkadot,
  [Chains.acala]: Acala,
  [Chains.bifrost]: Bifrost,
  [Chains.calamari]: Calamari,
  [Chains.centrifuge]: Centrifuge,
  [Chains.crab]: Crab,
  [Chains.crust]: Crust,
  [Chains.interlay]: Interlay,
  [Chains.kabocha]: Kabocha,
  [Chains.karura]: Karura,
  [Chains.khala]: Khala,
  [Chains.phala]: Phala,
  [Chains.polkadex]: Polkadex,
  [Chains.turing]: Turing,
  [Chains.kintsugi]: Kintsugi,
  [Chains.litmus]: Litmus,
};

const darkImageMap = {
  [Chains.kusama]: KusamaDark,
  [Chains.centrifuge]: CentrifugeDark,
  [Chains.crust]: CrustDark,
  [Chains.interlay]: InterlayDark,
  [Chains.polkadex]: PolkadexDark,
};

function ChainIcon({ chain, theme }) {
  let image = imageMap[chain];
  if (theme.isDark && darkImageMap[chain]) {
    image = darkImageMap[chain];
  }

  if (!image) {
    throw new Error(`Can not get icon of ${chain}`);
  }

  return <img width={24} height={24} src={image.src} alt="" className="logo" />;
}

export default withTheme(ChainIcon);
