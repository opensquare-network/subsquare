import { WagmiProvider as Provider } from "wagmi";
import { http, createConfig } from "wagmi";
import { mainnet, base } from "wagmi/chains";

const wagmiConfig = createConfig({
  chains: [mainnet, base],
  connectors: [],
  transports: {
    [mainnet.id]: http(),
    [base.id]: http(),
  },
});

export default function WagmiProvider({ children }) {
  return (
    <Provider config={wagmiConfig} reconnectOnMount={false}>
      {children}
    </Provider>
  );
}
