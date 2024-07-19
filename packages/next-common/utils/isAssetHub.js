import { isAssetHubChain } from "./chain";

export default function isAssetHub() {
  return isAssetHubChain(process.env.NEXT_PUBLIC_CHAIN);
}
