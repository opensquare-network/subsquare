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
    if (address) {
      fetchAvatar(address).then((result) => {
        if (result === avatar) {
          return;
        }

        setAvatar(result);
      });
    }
  }, [address, avatar]);

  return [avatar, !isNil(avatar)];
}
