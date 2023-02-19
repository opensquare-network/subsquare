import React from "react";
import { getExcludeChains } from "../../viewfuncs";
import Chains from "../chains";
import MenuIconWrapper from "../../../components/icons/menuIconWrapper";
import MotionIcon from "../../../assets/imgs/icons/type-motions.svg";
import AnnouncementIcon from "../../../assets/imgs/icons/type-announcements.svg";

const motions = {
  value: "allianceMotions",
  name: "Motions",
  pathname: "/alliance/motions",
  icon: (
    <MenuIconWrapper>
      <MotionIcon />
    </MenuIconWrapper>
  ),
}

const announcements = {
  value: "allianceAnnouncements",
  name: "Announcements",
  pathname: "/alliance/announcements",
  icon: (
    <MenuIconWrapper>
      <AnnouncementIcon />
    </MenuIconWrapper>
  ),
}

const alliance = {
  name: "ALLIANCE",
  excludeToChains: getExcludeChains([Chains["westend-collectives"]]),
  items: [
    announcements,
    motions,
  ],
}

export default alliance;
