import { useConnectedAccount } from "next-common/context/connectedAccount";
import { useUser } from "next-common/context/user";
import { isSameAddress } from "next-common/utils";
import { useCallback } from "react";

export function isLinkedToSimaDiscussion(post) {
  return (
    post.refToPost?.postType === "post" && post.refToPost?.dataSource === "sima"
  );
}

export function isLinkedToOffChainDiscussion(post) {
  return (
    post.refToPost?.postType === "post" && post.refToPost?.dataSource !== "sima"
  );
}

export function useFindMyUpVote() {
  const user = useUser();
  const connectedAccount = useConnectedAccount();

  return useCallback(
    (reactions) => {
      if (!user && !connectedAccount) {
        return null;
      }

      return (reactions || []).find((r) => {
        if ((r.reaction ?? 1) !== 1) return false;
        return r.dataSource === "sima"
          ? isSameAddress(r.proposer, connectedAccount?.address)
          : r.user?.username === user?.username;
      });
    },
    [user, connectedAccount],
  );
}

export function useFindMyDownVote() {
  const user = useUser();
  const connectedAccount = useConnectedAccount();

  return useCallback(
    (reactions) => {
      if (!user && !connectedAccount) {
        return null;
      }

      return (reactions || []).find((r) => {
        if (r.reaction !== 0) return false;
        return r.dataSource === "sima"
          ? isSameAddress(r.proposer, connectedAccount?.address)
          : r.user?.username === user?.username;
      });
    },
    [user, connectedAccount],
  );
}

export function checkSimaDataSource(data) {
  if (data.dataSource !== "sima") {
    throw new Error("Invalid data source");
  }
}

export function getRealField(realAddress) {
  if (!realAddress) {
    return;
  }

  return {
    address: realAddress,
    section: "proxy",
  };
}
