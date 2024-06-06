import hydradx from "next-common/utils/consts/settings/hydradx";
import { WagmiProvider as Provider } from "wagmi";
import { http, createConfig } from "wagmi";
import { mainnet, base, darwinia, moonbeam, moonriver } from "wagmi/chains";
import { coinbaseWallet, injected } from "wagmi/connectors";

export const wagmiConfig = createConfig({
  chains: [
    mainnet,
    base,
    darwinia,
    moonbeam,
    moonriver,
    hydradx.wagmiChainConfig,
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
  },
});

export default function WagmiProvider({ children }) {
  return <Provider config={wagmiConfig}>{children}</Provider>;
}
