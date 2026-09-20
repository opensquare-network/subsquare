import { walletConnect } from "wagmi/connectors";
import { CHAIN } from "next-common/utils/constants";
import getChainSettings from "next-common/utils/consts/settings";

export default function walletConnectEvm(config) {
  const { description, domain } = getChainSettings(CHAIN);
  const url =
    typeof window === "undefined"
      ? `https://${domain || CHAIN}.subsquare.io`
      : window.location.origin;

  return walletConnect({
    projectId: process.env.NEXT_PUBLIC_WALLETCONNECT_PROJECT_ID,
    // Keep EVM sessions separate from the existing Polkadot provider.
    customStoragePrefix: "subsquare-evm",
    showQrModal: true,
    metadata: {
      name: "Subsquare",
      description,
      url,
      icons: [`${url}/favicon.ico`],
    },
  })(config);
}
