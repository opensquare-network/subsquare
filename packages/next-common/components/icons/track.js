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
  TrackAllIcon,
  TrackDefaultIcon,
  Track0Icon,
  Track1Icon,
  Track10Icon,
  Track11Icon,
  Track12Icon,
  Track13Icon,
  Track14Icon,
  Track15Icon,
  Track20Icon,
  Track21Icon,
  Track30Icon,
  Track31Icon,
  Track32Icon,
  Track33Icon,
  Track34Icon,
};

Object.keys(TrackIconMap).forEach((name) => {
  const id = name.replace("Track", "").replace("Icon", "");
  const Icon = TrackIconMap[name];

  TrackIconMap[id] = (
    <IconWrapper>
      <Icon />
    </IconWrapper>
  );
});

export default TrackIconMap;
