import Avatar from "next-common/components/avatar";

export function DelegateAvatar({ address, image }) {
  return (
    <div className="flex flex-col">
      <div className="relative w-10 h-10">
        {image ? (
          <img
            className="rounded-full"
            src={image}
            width={40}
            height={40}
            alt="avatar image"
          />
        ) : (
          <Avatar address={address} size={40} />
        )}
      </div>
    </div>
  );
}
