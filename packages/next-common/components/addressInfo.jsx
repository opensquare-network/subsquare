import styled from "styled-components";
import Avatar from "./avatar";
import { cn } from "next-common/utils";

const Skeleton = styled.div`
  border-radius: 4px;
  background: linear-gradient(
    90deg,
    rgba(235, 238, 244, 0.8) 0%,
    rgba(235, 238, 244, 0.2) 100%
  );
`;

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
