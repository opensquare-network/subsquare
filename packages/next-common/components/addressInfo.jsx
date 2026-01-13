import Avatar from "./avatar";
import { cn } from "next-common/utils";
import { Skeleton } from "./skeleton";

export default function AddressInfoLoading({ address, size = "default" }) {
  const avatarSize = size === "default" ? 40 : 24;

  return (
    <>
      <Avatar address={address} size={avatarSize} />
      <div className="flex flex-col gap-2 w-full">
        <Skeleton
          className={cn("h-[12px] w-[80px]", size === "small" && "hidden")}
        />
        <Skeleton
          className={cn(
            "h-[12px] max-w-full",
            size === "default" ? "w-[240px]" : "w-auto",
          )}
        />
      </div>
    </>
  );
}
