import { useEffect, useState } from "react";
import {
  fetchAvatar,
  getCachedAvatar,
  removeCachedAvatar,
} from "next-common/services/avatar";
import { isNil } from "lodash-es";

let trigger = 0;

export function refreshAvatar(address) {
  removeCachedAvatar(address);
  trigger++;
}

export default function useAvatarInfo(address) {
  const cachedAvatar = getCachedAvatar(address);
  const [avatar, setAvatar] = useState(cachedAvatar);

  useEffect(() => {
    setAvatar(null);
    if (address) {
      fetchAvatar(address).then((avatar) => setAvatar(avatar));
    }
  }, [address, trigger]);

  return [avatar, !isNil(avatar)];
}
