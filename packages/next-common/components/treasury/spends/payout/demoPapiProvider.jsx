import { useMemo } from "react";
import PapiContext from "next-common/context/papi";
import { DEMO_PALLETS } from "./demoData";
import {
  createDemoFetchSpendPosts,
  createDemoFetchSpendsList,
  createDemoPapiApi,
} from "./demoApi";
import { SpendPostsProvider } from "./spendPostsContext";
import { PayoutQueueSourceProvider } from "./sourceContext";

export default function DemoPapiProvider({ children }) {
  const api = useMemo(() => createDemoPapiApi(), []);
  const fetchSpendPosts = useMemo(() => createDemoFetchSpendPosts(), []);
  const fetchSpendsList = useMemo(() => createDemoFetchSpendsList(), []);

  const value = useMemo(
    () => ({ api, client: null, pallets: DEMO_PALLETS, blockHash: null }),
    [api],
  );

  return (
    <PapiContext.Provider value={value}>
      <SpendPostsProvider
        fetchSpendPosts={fetchSpendPosts}
        fetchSpendsList={fetchSpendsList}
      >
        <PayoutQueueSourceProvider>{children}</PayoutQueueSourceProvider>
      </SpendPostsProvider>
    </PapiContext.Provider>
  );
}
