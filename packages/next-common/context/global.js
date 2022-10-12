import ChainProvider from "./chain";
import UserProvider from "./user";

export default function GlobalProvider({ user, chain, children }) {
  return (
    <ChainProvider chain={ chain }>
      <UserProvider user={ user }>
        { children }
      </UserProvider>
    </ChainProvider>
  )
}
