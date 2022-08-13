import React from "react";
import { withTheme } from "styled-components";
import getChainSettings from "../../utils/consts/settings";

function ChainIcon({ chain, theme }) {
  const chainSetting = getChainSettings(chain);
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
