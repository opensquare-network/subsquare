import { useChain, useChainSettings } from "next-common/context/chain";
import { useThemeSetting } from "next-common/context/theme";
import React, { useEffect, useState } from "react";

export default function ChainIcon() {
  const theme = useThemeSetting();
  const chain = useChain();
  const chainSetting = useChainSettings();
  const [image, setImage] = useState(chainSetting.avatar);

  useEffect(() => {
    if (theme.isDark && chainSetting.darkAvatar) {
      setImage(chainSetting.darkAvatar);
    }
  }, [theme.isDark, chainSetting.darkAvatar]);

  if (!image) {
    throw new Error(`Can not get icon of ${chain}`);
  }

  return <img width={24} height={24} src={image.src} alt="" className="logo" />;
}
