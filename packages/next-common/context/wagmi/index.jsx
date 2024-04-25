import { WagmiProvider as Provider } from "wagmi";
import { http, createConfig } from "wagmi";
import { mainnet, base } from "wagmi/chains";
import { safe, walletConnect } from "wagmi/connectors";

const projectId = "subsquare";

const wagmiConfig = createConfig({
  chains: [mainnet, base],
  connectors: [walletConnect({ projectId }), safe()],
  transports: {
    [mainnet.id]: http(),
    [base.id]: http(),
  },
});

export default function WagmiProvider({ children }) {
  return <Provider config={wagmiConfig}>{children}</Provider>;
}
