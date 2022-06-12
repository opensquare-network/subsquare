import React, { memo } from "react";
import Chains from "../../utils/consts/chains";
import Kusama from "../../assets/icons/chain/kusama.svg";
import Polkadot from "../../assets/icons/chain/polkadot.svg";
import Acala from "../../assets/icons/chain/acala.svg";
import Bifrost from "../../assets/icons/chain/bifrost.svg";
import Calamari from "../../assets/icons/chain/calamari.svg";
import Crab from "../../assets/icons/chain/crab.png";
import Crust from "../../assets/icons/chain/crust.svg";
import Interlay from "../../assets/icons/chain/interlay.svg";
import Kabocha from "../../assets/icons/chain/kabocha.svg";
import Karura from "../../assets/icons/chain/karura.svg";
import Khala from "../../assets/icons/chain/khala.svg";
import Polkadex from "../../assets/icons/chain/polkadex.svg";
import Turing from "../../assets/icons/chain/turing.svg";
import Kintsugi from "../../assets/icons/chain/kintsugi.png";
import Centrifuge from "../../assets/icons/chain/centrifuge.svg";

const iconMap = {
  [Chains.kusama]: <Kusama />,
  [Chains.polkadot]: <Polkadot />,
  [Chains.acala]: <Acala />,
  [Chains.bifrost]: <Bifrost />,
  [Chains.calamari]: <Calamari />,
  [Chains.centrifuge]: <Centrifuge />,
  [Chains.crab]: (
    <img width={24} height={24} src={Crab.src} alt="" className="logo" />
  ),
  [Chains.crust]: <Crust />,
  [Chains.interlay]: <Interlay />,
  [Chains.kabocha]: <Kabocha />,
  [Chains.karura]: <Karura />,
  [Chains.khala]: <Khala />,
  [Chains.polkadex]: <Polkadex />,
  [Chains.turing]: <Turing />,
  [Chains.kintsugi]: (
    <img width={24} height={24} src={Kintsugi.src} alt="" className="logo" />
  ),
};

function ChainIcon({ chain }) {
  const icon = iconMap[chain];
  if (!icon) {
    throw new Error(`Can not get icon of ${chain}`);
  }

  return icon;
}

export default memo(ChainIcon);
