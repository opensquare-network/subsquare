import { useEffect, useState } from "react";
import { fetchAvatar, getCachedAvatar } from "next-common/services/avatar";
import { isNil } from "lodash-es";

export default function useAvatarInfo(address) {
  const cachedAvatar = getCachedAvatar(address);
  const [avatar, setAvatar] = useState(cachedAvatar);

  useEffect(() => {
    setAvatar(null);
    if (address) {
      fetchAvatar(address).then((avatar) => setAvatar(avatar));
    }
  }, [address]);

  return [avatar, !isNil(avatar)];
}
