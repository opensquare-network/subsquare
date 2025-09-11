import { useUser } from "next-common/context/user";
import nextApi from "next-common/services/nextApi";
import { useCallback } from "react";

export function useGetUserDiscussions() {
  const user = useUser();

  return useCallback(async () => {
    if (!user) {
      throw new Error("User is not logged in yet");
    }
    return await nextApi.fetch(`users/${user?.address}/all-posts`);
  }, [user]);
}
