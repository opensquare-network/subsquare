import { WagmiProvider as Provider } from "wagmi";
import { http, createConfig } from "wagmi";
import { mainnet, base } from "wagmi/chains";
import { coinbaseWallet, injected } from "wagmi/connectors";

export const wagmiConfig = createConfig({
  chains: [mainnet, base],
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
  },
});

export default function WagmiProvider({ children }) {
  return <Provider config={wagmiConfig}>{children}</Provider>;
}
