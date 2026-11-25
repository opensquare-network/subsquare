import { createContext, useContext, useMemo } from "react";
import { fetchTreasurySpendPosts, fetchTreasurySpendsList } from "./spendPosts";

const SpendPostsContext = createContext({
  fetchSpendPosts: fetchTreasurySpendPosts,
  fetchSpendsList: fetchTreasurySpendsList,
});

export function SpendPostsProvider({
  fetchSpendPosts = fetchTreasurySpendPosts,
  fetchSpendsList = fetchTreasurySpendsList,
  children,
}) {
  const value = useMemo(
    () => ({ fetchSpendPosts, fetchSpendsList }),
    [fetchSpendPosts, fetchSpendsList],
  );

  return (
    <SpendPostsContext.Provider value={value}>
      {children}
    </SpendPostsContext.Provider>
  );
}

export function useFetchSpendPosts() {
  return useContext(SpendPostsContext).fetchSpendPosts;
}

export function useFetchSpendsList() {
  return useContext(SpendPostsContext).fetchSpendsList;
}
