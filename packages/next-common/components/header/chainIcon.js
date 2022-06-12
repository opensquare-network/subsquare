import React, { memo } from "react";
import Chains from "../../utils/consts/chains";
import Kusama from "../../assets/icons/chain/kusama.svg";
import Polkadot from "../../assets/icons/chain/polkadot.svg";
import Acala from "../../assets/icons/chain/acala.svg";
import Bifrost from "../../assets/icons/chain/bifrost.svg";
import Calamari from "../../assets/icons/chain/calamari.svg";
import Crab from "../../assets/icons/chain/crab.svg";
import Crust from "../../assets/icons/chain/crust.svg";
import Interlay from "../../assets/icons/chain/interlay.svg";
import Kabocha from "../../assets/icons/chain/kabocha.svg";
import Karura from "../../assets/icons/chain/karura.svg";
import Khala from "../../assets/icons/chain/khala.svg";
import Polkadex from "../../assets/icons/chain/polkadex.svg";
import Turing from "../../assets/icons/chain/turing.svg";
import Kintsugi from "../../assets/icons/chain/kintsugi.png";

function ChainIcon({ chain }) {
  if (Chains.kusama === chain) {
    return <Kusama />;
  } else if (Chains.polkadot === chain) {
    return <Polkadot />;
  } else if (Chains.acala === chain) {
    return <Acala />;
  } else if (Chains.bifrost === chain) {
    return <Bifrost />;
  } else if (Chains.calamari === chain) {
    return <Calamari />;
  } else if (Chains.crab === chain) {
    return <Crab />;
  } else if (Chains.crust === chain) {
    return <Crust />;
  } else if (Chains.interlay === chain) {
    return <Interlay />;
  } else if (Chains.kabocha === chain) {
    return <Kabocha />;
  } else if (Chains.karura === chain) {
    return <Karura />;
  } else if (Chains.khala === chain) {
    return <Khala />;
  } else if (Chains.polkadex === chain) {
    return <Polkadex />;
  } else if (Chains.turing === chain) {
    return <Turing />;
  } else if (Chains.kintsugi === chain) {
    return (
      <img width={24} height={24} src={Kintsugi.src} alt="" className="logo" />
    );
  }

  throw new Error(`Can not get icon of ${chain}`);
}

export default memo(ChainIcon);
