import getStorageLink from "next-common/utils/env/storageLink";
import Avatar from "../avatar";
import Gravatar from "../gravatar";
import { AvatarImg } from "./styled";

export const AvatarDisplay = ({ address, emailMd5, avatarCid, size }) => {
  return avatarCid ? (
    <AvatarImg src={getStorageLink(avatarCid)} size={size} />
  ) : address ? (
    <Avatar address={address} size={size} />
  ) : (
    <Gravatar emailMd5={emailMd5} size={size} />
  );
};
