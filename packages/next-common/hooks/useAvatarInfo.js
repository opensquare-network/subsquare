import { useEffect, useState } from "react";
import {
  fetchAvatar,
  getCachedAvatar,
  removeCachedAvatar,
} from "next-common/services/avatar";
import { isNil } from "lodash-es";
import { useSelector } from "react-redux";
import {
  avatarTriggerSelector,
  setAvatarTrigger,
} from "next-common/store/reducers/avatarSlice";
import { store } from "next-common/store";

export async function refreshAvatar(address) {
  removeCachedAvatar(address);
  await fetchAvatar(address);
  store.dispatch(setAvatarTrigger());
}

export default function useAvatarInfo(address) {
  const cachedAvatar = getCachedAvatar(address);
  const [avatar, setAvatar] = useState(cachedAvatar);
  const trigger = useSelector(avatarTriggerSelector);

  useEffect(() => {
    setAvatar(cachedAvatar);
  }, [cachedAvatar, trigger]);

  useEffect(() => {
    if (!address) {
      return;
    }

    let cancelled = false;

    fetchAvatar(address)
      .then((result) => {
        if (!cancelled) {
          setAvatar(result);
        }
      })
      .catch(() => {
        if (!cancelled) {
          setAvatar(null);
        }
      });

    return () => {
      cancelled = true;
    };
  }, [address]);

  return [avatar, !isNil(avatar)];
}
