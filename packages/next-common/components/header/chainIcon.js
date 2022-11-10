import React from "react";
import { withTheme } from "styled-components";
import { useChain, useChainSettings } from "../../context/chain";

function ChainIcon({ theme }) {
  const chain = useChain();
  const chainSetting = useChainSettings();
  let image = chainSetting.avatar;
  if (theme.isDark && chainSetting.darkAvatar) {
    image = chainSetting.darkAvatar;
  }

  if (!image) {
    throw new Error(`Can not get icon of ${chain}`);
  }

  return <img width={24} height={24} src={image.src} alt="" className="logo" />;
}

export default withTheme(ChainIcon);
