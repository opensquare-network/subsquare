import getIpfsLink from "next-common/utils/env/ipfsEndpoint";
import Avatar from "../avatar";
import Gravatar from "../gravatar";
import { AvatarImg } from "./styled";

export const AvatarDisplay = ({ address, emailMd5, avatarCid, size }) => {
  const normalizedSize = isNaN(size) ? size : `${size}px`;
  return avatarCid ? (
    <AvatarImg src={getIpfsLink(avatarCid)} size={normalizedSize} />
  ) : address ? (
    <Avatar address={address} size={normalizedSize} />
  ) : (
    <Gravatar emailMd5={emailMd5} size={normalizedSize} />
  );
};
