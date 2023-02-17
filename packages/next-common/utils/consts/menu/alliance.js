import { getExcludeChains } from "../../viewfuncs";
import Chains from "../chains";
import MenuIconWrapper from "../../../components/icons/menuIconWrapper";
import MotionIcon from "../../../assets/imgs/icons/type-motions.svg";

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

const alliance = {
  name: "ALLIANCE",
  excludeToChains: getExcludeChains([Chains["westend-collectives"]]),
  items: [
    motions,
  ],
}

export default alliance;
