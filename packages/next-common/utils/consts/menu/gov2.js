import React from "react";
import Gov2IconOrigin from "../../../assets/imgs/icons/type-gov2.svg";
import BackIcon from "../../../assets/imgs/icons/back.svg";
import Gov2Button from "../../../components/menu/gov2Button";
import TrackIconMap from "../../../components/icons/track";
import { getExcludeChains } from "../../viewfuncs";
import Chains from "../chains";
import styled from "styled-components";

const Gov2Icon = styled(Gov2IconOrigin)`
  path {
    fill: ${(p) => p.theme.textContrast} !important;
  }
`;

const gov2EntryMenu = {
  items: [
    {
      value: "gov2",
      name: "Governance V2",
      pathname: "/referenda",
      icon: <Gov2Icon />,
      itemRender: (icon, name) => <Gov2Button icon={icon} name={name} />,
    },
  ],
  excludeToChains: getExcludeChains([Chains.kusama, Chains.development]),
};

const gov2BackMenu = {
  items: [
    {
      value: "gov1",
      name: "Back to Gov1",
      pathname: "/",
      icon: <BackIcon />,
    },
  ],
};

const gov2ReferendaMenu = {
  name: "REFERENDA",
  items: [
    {
      value: "all",
      name: "All",
      pathname: "/referenda",
      icon: TrackIconMap.All,
    },
  ],
};

const gov2FellowshipMenu = {
  name: "FELLOWSHIP",
  tip: "Upcoming",
  items: [],
};

export { gov2EntryMenu, gov2BackMenu, gov2ReferendaMenu, gov2FellowshipMenu };
