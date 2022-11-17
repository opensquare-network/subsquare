import React from "react";
import TrackAllIcon from "../../assets/imgs/icons/track-all.svg";
import TrackDefaultIcon from "../../assets/imgs/icons/track-default.svg";
import Track0Icon from "../../assets/imgs/icons/track-0.svg";
import Track1Icon from "../../assets/imgs/icons/track-1.svg";
import Track10Icon from "../../assets/imgs/icons/track-10.svg";
import Track11Icon from "../../assets/imgs/icons/track-11.svg";
import Track12Icon from "../../assets/imgs/icons/track-12.svg";
import Track13Icon from "../../assets/imgs/icons/track-13.svg";
import Track14Icon from "../../assets/imgs/icons/track-14.svg";
import Track15Icon from "../../assets/imgs/icons/track-15.svg";
import Track20Icon from "../../assets/imgs/icons/track-20.svg";
import Track21Icon from "../../assets/imgs/icons/track-21.svg";
import Track30Icon from "../../assets/imgs/icons/track-30.svg";
import Track31Icon from "../../assets/imgs/icons/track-31.svg";
import Track32Icon from "../../assets/imgs/icons/track-32.svg";
import Track33Icon from "../../assets/imgs/icons/track-33.svg";
import Track34Icon from "../../assets/imgs/icons/track-34.svg";
import styled from "styled-components";

const IconWrapper = styled.span`
  display: inline-flex;

  svg {
    path {
      fill: ${(p) => p.theme.textSecondary};
    }
  }
`;

const TrackIconMap = {
  All: wrapIcon(<TrackAllIcon />),
  Default: wrapIcon(<TrackDefaultIcon />),
  0: wrapIcon(<Track0Icon />),
  1: wrapIcon(<Track1Icon />),
  10: wrapIcon(<Track10Icon />),
  11: wrapIcon(<Track11Icon />),
  12: wrapIcon(<Track12Icon />),
  13: wrapIcon(<Track13Icon />),
  14: wrapIcon(<Track14Icon />),
  15: wrapIcon(<Track15Icon />),
  20: wrapIcon(<Track20Icon />),
  21: wrapIcon(<Track21Icon />),
  30: wrapIcon(<Track30Icon />),
  31: wrapIcon(<Track31Icon />),
  32: wrapIcon(<Track32Icon />),
  33: wrapIcon(<Track33Icon />),
  34: wrapIcon(<Track34Icon />),
};

function wrapIcon(icon) {
  return <IconWrapper>{icon}</IconWrapper>;
}

export default TrackIconMap;
