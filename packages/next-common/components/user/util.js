import { useMemo } from "react";

const widths = {
  // avatar + avatar margin right
  avatar: 28,
  // identity icon + identity margin right
  identity: 16,
};

export function useWidth(showAvatar, identity, maxWidth) {
  return useMemo(() => {
    if (!maxWidth) return maxWidth;

    let res = maxWidth;
    if (showAvatar) {
      res -= widths.avatar;
    }
    if (identity) {
      res -= widths.identity;
    }

    return res;
  }, [showAvatar, identity, maxWidth]);
}
