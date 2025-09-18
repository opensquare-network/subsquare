import { CHAIN } from "next-common/utils/constants";
import { capitalize } from "lodash-es";

export default function generateLayoutRawTitle(title) {
  const chain = capitalize(CHAIN);
  return `Subsquare | ${chain} ${title}`;
}
