"use client";

import { createContext, useContext, useMemo } from "react";
import useMyFriendGroups from "./hooks/useMyFriendGroups";
import useMyInheritor from "./hooks/useMyInheritor";
import useMyRecoveryAttempts from "./hooks/useMyRecoveryAttempts";

const RecoveryDataContext = createContext(null);

export function RecoveryDataProvider({ address, children }) {
  const {
    data: friendGroups,
    loading: friendGroupsLoading,
    fetch: fetchFriendGroups,
  } = useMyFriendGroups(address);

  const {
    data: inheritor,
    loading: inheritorLoading,
    fetch: fetchInheritor,
  } = useMyInheritor(address);

  const {
    data: attempts,
    loading: attemptsLoading,
    fetch: fetchAttempts,
  } = useMyRecoveryAttempts(address);

  const loading = friendGroupsLoading || inheritorLoading || attemptsLoading;

  const value = useMemo(
    () => ({
      friendGroups,
      friendGroupsLoading,
      fetchFriendGroups,
      inheritor,
      inheritorLoading,
      fetchInheritor,
      attempts,
      attemptsLoading,
      fetchAttempts,
      loading,
      address,
    }),
    [
      friendGroups,
      friendGroupsLoading,
      fetchFriendGroups,
      inheritor,
      inheritorLoading,
      fetchInheritor,
      attempts,
      attemptsLoading,
      fetchAttempts,
      loading,
      address,
    ],
  );

  return (
    <RecoveryDataContext.Provider value={value}>
      {children}
    </RecoveryDataContext.Provider>
  );
}

export function useRecoveryData() {
  const context = useContext(RecoveryDataContext);
  if (!context) {
    throw new Error(
      "useRecoveryData must be used within a RecoveryDataProvider",
    );
  }
  return context;
}
