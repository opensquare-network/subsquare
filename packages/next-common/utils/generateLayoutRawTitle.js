import { CHAIN } from "next-common/utils/constants";
import getChainSettings from "./consts/settings";

export default function generateLayoutRawTitle(title) {
  const { name } = getChainSettings(CHAIN);
  return `Subsquare | ${name} ${title}`;
}
