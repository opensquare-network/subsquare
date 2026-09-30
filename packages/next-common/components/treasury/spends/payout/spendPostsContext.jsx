import { createContext, useContext } from "react";
import { fetchTreasurySpendPosts } from "./spendPosts";

const SpendPostsContext = createContext(fetchTreasurySpendPosts);

export function SpendPostsProvider({ fetchSpendPosts, children }) {
  return (
    <SpendPostsContext.Provider value={fetchSpendPosts}>
      {children}
    </SpendPostsContext.Provider>
  );
}

export default function useFetchSpendPosts() {
  return useContext(SpendPostsContext);
}
