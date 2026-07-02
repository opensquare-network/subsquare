"use client";

import { createContext, useContext, useMemo } from "react";
import useInheritedAccounts from "./hooks/useInheritedAccounts";
import useInheritorFriendGroups from "./hooks/useInheritorFriendGroups";

const InheritorsDataContext = createContext(null);

export function InheritorsDataProvider({ address, children }) {
  const {
    data: inheritedAccounts,
    loading: inheritedAccountsLoading,
    fetch: fetchInheritedAccounts,
  } = useInheritedAccounts(address);

  const {
    data: inheritorFriendGroups,
    loading: inheritorFriendGroupsLoading,
    fetch: fetchInheritorFriendGroups,
  } = useInheritorFriendGroups(address);

  const loading = inheritedAccountsLoading || inheritorFriendGroupsLoading;

  const value = useMemo(
    () => ({
      address,
      inheritedAccounts,
      inheritedAccountsLoading,
      fetchInheritedAccounts,
      inheritorFriendGroups,
      inheritorFriendGroupsLoading,
      fetchInheritorFriendGroups,
      loading,
    }),
    [
      address,
      inheritedAccounts,
      inheritedAccountsLoading,
      fetchInheritedAccounts,
      inheritorFriendGroups,
      inheritorFriendGroupsLoading,
      fetchInheritorFriendGroups,
      loading,
    ],
  );

  return (
    <InheritorsDataContext.Provider value={value}>
      {children}
    </InheritorsDataContext.Provider>
  );
}

export function useInheritorsData() {
  const context = useContext(InheritorsDataContext);
  if (!context) {
    throw new Error(
      "useInheritorsData must be used within a InheritorsDataProvider",
    );
  }
  return context;
}
