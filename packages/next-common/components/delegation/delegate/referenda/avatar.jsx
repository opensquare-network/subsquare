import AddressAvatar from "next-common/components/user/addressAvatar";
import { useAddressAvatarMap } from "next-common/context/avatar";

export function DelegateAvatar({ address }) {
  const addressAvatarMap = useAddressAvatarMap();
  const image = addressAvatarMap?.get(address);

  return (
    <div className="flex flex-col">
      <div className="relative w-10 h-10">
        {image ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            className="rounded-full"
            src={image}
            width={40}
            height={40}
            alt="avatar image"
          />
        ) : (
          <AddressAvatar address={address} size={40} />
        )}
      </div>
    </div>
  );
}
