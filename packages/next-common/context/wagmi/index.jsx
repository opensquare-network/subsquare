import centrifugeSettings from "next-common/utils/consts/settings/centrifuge";
import hydradxSettings from "next-common/utils/consts/settings/hydradx";
import shibuyaSettings from "next-common/utils/consts/settings/shibuya";
import { compatWagmiChainConfig } from "next-common/utils/evm/wagmi";
import { WagmiProvider as Provider } from "wagmi";
import { http, createConfig } from "wagmi";
import { mainnet, base, darwinia, moonbeam, moonriver } from "wagmi/chains";
import { coinbaseWallet, injected } from "wagmi/connectors";

const hydradx = compatWagmiChainConfig(hydradxSettings.ethereumNetwork);
const centrifuge = compatWagmiChainConfig(centrifugeSettings.ethereumNetwork);
const shibuya = compatWagmiChainConfig(shibuyaSettings.ethereumNetwork);

export const wagmiConfig = createConfig({
  chains: [
    mainnet,
    base,
    darwinia,
    moonbeam,
    moonriver,
    hydradx,
    centrifuge,
    shibuya,
  ],
  ssr: true,
  connectors: [
    injected(),
    coinbaseWallet({
      appName: "subsquare",
    }),
  ],
  transports: {
    [mainnet.id]: http(),
    [base.id]: http(),
    [darwinia.id]: http(),
    [moonbeam.id]: http(),
    [moonriver.id]: http(),
    [hydradx.id]: http(),
    [centrifuge.id]: http(),
    // [shibuya.id]: http(),
  },
});

export default function WagmiProvider({ children }) {
  return <Provider config={wagmiConfig}>{children}</Provider>;
}
