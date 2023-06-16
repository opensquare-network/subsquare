import getChainSettings from "./consts/settings";

export default function hasDispatchPrecompile() {
  const chain = process.env.NEXT_PUBLIC_CHAIN;
  const settings = getChainSettings(chain);
  return !settings?.noDispatchPrecompile;
}
