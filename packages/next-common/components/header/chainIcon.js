import { useChain, useChainSettings } from "next-common/context/chain";
import { useThemeSetting } from "next-common/context/theme";
import React from "react";

export default function ChainIcon() {
  const theme = useThemeSetting();
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
