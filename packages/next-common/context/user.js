import { createContext, useContext } from "react";

const UserContext = createContext(null);

export default function UserProvider({ user, children }) {
  return <UserContext.Provider value={ user }>
    { children }
  </UserContext.Provider>
}

export function useUser() {
  return useContext(UserContext);
}

export function useIsLogin() {
  const user = useContext(UserContext);
  return !!user;
}
