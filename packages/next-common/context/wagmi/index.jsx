import { WagmiProvider as Provider } from "wagmi";
import { http, createConfig } from "wagmi";
import { mainnet, base } from "wagmi/chains";
import { injected } from "wagmi/connectors";

const wagmiConfig = createConfig({
  chains: [mainnet, base],
  connectors: [injected()],
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
