import { walletConnect } from "wagmi/connectors";
import { CHAIN } from "next-common/utils/constants";
import getChainSettings from "next-common/utils/consts/settings";

export default function walletConnectEvm(config) {
  const { description, domain } = getChainSettings(CHAIN);
  const url =
    typeof window === "undefined"
      ? `https://${domain || CHAIN}.subsquare.io`
      : window.location.origin;

  const connector = walletConnect({
    projectId: process.env.NEXT_PUBLIC_WALLETCONNECT_PROJECT_ID,
    // Keep EVM sessions separate from the existing Polkadot provider.
    customStoragePrefix: "subsquare-evm",
    showQrModal: false,
    metadata: {
      name: "Subsquare",
      description,
      url,
      icons: [`${url}/favicon.ico`],
    },
  })(config);

  let pendingConnection;
  let uri;
  return {
    ...connector,
    onDisplayUri(value) {
      uri = value;
      connector.onDisplayUri(value);
    },
    async connect(parameters) {
      // Reopening our QR view must reuse the pending pairing request.
      if (pendingConnection) {
        if (uri) {
          this.onDisplayUri(uri);
        }
        return await pendingConnection;
      }
      pendingConnection = connector.connect
        .call(this, parameters)
        .finally(() => {
          pendingConnection = null;
          uri = null;
        });
      return await pendingConnection;
    },
  };
}
