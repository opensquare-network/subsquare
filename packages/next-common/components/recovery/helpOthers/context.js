"use client";

import { createContext, useContext, useMemo } from "react";
import useHelpOthersFriendGroups from "./hooks/useHelpOthersFriendGroups";
import useHelpOthersAttempts from "./hooks/useHelpOthersAttempts";

const HelpOthersDataContext = createContext(null);

export function HelpOthersDataProvider({ address, children }) {
  const friendGroups = useHelpOthersFriendGroups(address);
  const attempts = useHelpOthersAttempts(address);

  const loading = friendGroups.loading || attempts.loading;

  const value = useMemo(
    () => ({
      address,
      friendGroupsData: friendGroups.data,
      friendGroupsLoading: friendGroups.loading,
      fetchFriendGroups: friendGroups.fetch,
      attemptsData: attempts.data,
      attemptsLoading: attempts.loading,
      attemptsFriendGroupsData: attempts.friendGroupsData,
      fetchAttempts: attempts.fetch,
      loading,
    }),
    [
      address,
      friendGroups.data,
      friendGroups.loading,
      friendGroups.fetch,
      attempts.data,
      attempts.loading,
      attempts.friendGroupsData,
      attempts.fetch,
      loading,
    ],
  );

  return (
    <HelpOthersDataContext.Provider value={value}>
      {children}
    </HelpOthersDataContext.Provider>
  );
}

export function useHelpOthersData() {
  const context = useContext(HelpOthersDataContext);
  if (!context) {
    throw new Error(
      "useHelpOthersData must be used within a HelpOthersDataProvider",
    );
  }
  return context;
}
