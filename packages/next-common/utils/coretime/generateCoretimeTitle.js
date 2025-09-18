import { CHAIN } from "next-common/utils/constants";
import { capitalize } from "lodash-es";

export default function generateCoretimeTitle(title) {
  const chain = capitalize(CHAIN);
  return `Subsquare | ${chain} ${title}`;
}
