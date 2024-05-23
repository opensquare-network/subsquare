import { useEffect, useState } from "react";
import {
  fetchAvatar,
  getCachedAvatar,
  removeCachedAvatar,
} from "next-common/services/avatar";
import { isNil } from "lodash-es";

export function refreshAvatar(address) {
  removeCachedAvatar(address);
  fetchAvatar(address);
}

export default function useAvatarInfo(address) {
  const cachedAvatar = getCachedAvatar(address);
  const [avatar, setAvatar] = useState(cachedAvatar);

  useEffect(() => {
    setAvatar(cachedAvatar);
  }, [cachedAvatar]);

  useEffect(() => {
    setAvatar(null);
    if (address) {
      fetchAvatar(address).then((avatar) => setAvatar(avatar));
    }
  }, [address]);

  return [avatar, !isNil(avatar)];
}
