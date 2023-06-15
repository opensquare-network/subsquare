import isNil from "lodash.isnil";
import getChainSettings from "./consts/settings";

export default function isEvmChain() {
  const chain = process.env.NEXT_PUBLIC_CHAIN;
  const settings = getChainSettings(chain);
  return !isNil(settings?.ethereumNetwork);
}
