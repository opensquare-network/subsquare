import useAvatarInfo from "next-common/hooks/useAvatarInfo";
import { AvatarDisplay } from "./avatarDisplay";
import { tryConvertToEvmAddress } from "next-common/utils/mixedChainUtil";

export default function AddressAvatar({ address, size = "24px" }) {
  const [avatar] = useAvatarInfo(address);
  const displayAddress = tryConvertToEvmAddress(address);

  return (
    <AvatarDisplay address={displayAddress} avatarCid={avatar} size={size} />
  );
}
