import React, { useEffect, useRef, useState } from "react";
import getStorageLink from "next-common/utils/env/storageLink";
import Avatar from "../avatar";
import Gravatar from "../gravatar";
import { AvatarImg, AvatarToggleWrapper } from "./styled";
import useAvatarInfo from "next-common/hooks/useAvatarInfo";

export const AvatarDisplay = ({
  address,
  emailMd5,
  avatarCid,
  size,
  toggleable = false,
}) => {
  if (toggleable) {
    return (
      <ToggleableAvatarDisplay
        address={address}
        emailMd5={emailMd5}
        avatarCid={avatarCid}
        size={size}
      />
    );
  }

  return avatarCid ? (
    <AvatarImg src={getStorageLink(avatarCid)} size={size} />
  ) : address ? (
    <Avatar address={address} size={size} />
  ) : (
    <Gravatar emailMd5={emailMd5} size={size} />
  );
};

function ToggleableAvatarDisplay({ address, emailMd5, avatarCid, size }) {
  const [fetchedAvatarCid] = useAvatarInfo(address);
  const [showChainAvatar, setShowChainAvatar] = useState(false);
  const cid = avatarCid || fetchedAvatarCid;
  const prevCidRef = useRef(cid);

  // Show the latest custom avatar when it changes (e.g. a new avatar was just set)
  useEffect(() => {
    if (prevCidRef.current !== cid) {
      prevCidRef.current = cid;
      setShowChainAvatar(false);
    }
  }, [cid]);

  if (!cid) {
    return address ? (
      <Avatar address={address} size={size} />
    ) : (
      <Gravatar emailMd5={emailMd5} size={size} />
    );
  }

  return (
    <AvatarToggleWrapper
      onClick={(e) => {
        e.preventDefault();
        e.stopPropagation();
        setShowChainAvatar((value) => !value);
      }}
    >
      {showChainAvatar ? (
        <Avatar address={address} size={size} showCustomAvatar={false} />
      ) : (
        <AvatarImg src={getStorageLink(cid)} size={size} />
      )}
    </AvatarToggleWrapper>
  );
}
