import React, { useEffect, useState } from "react";
import { withTheme } from "styled-components";
import getChainSettings from "../../utils/consts/settings";

function ChainIcon({ chain, theme }) {
  const chainSetting = getChainSettings(chain);
  const [image, setImage] = useState(chainSetting.avatar);

  useEffect(() => {
    if (theme.isDark && chainSetting.darkAvatar) {
      setImage(chainSetting.darkAvatar);
    } else {
      setImage(chainSetting.avatar);
    }
  }, [theme.isDark]);

  if (!image) {
    throw new Error(`Can not get icon of ${chain}`);
  }

  return <img width={24} height={24} src={image.src} alt="" className="logo" />;
}

export default withTheme(ChainIcon);
