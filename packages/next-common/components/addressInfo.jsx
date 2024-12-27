import styled from "styled-components";
import Avatar from "./avatar";

const Skeleton = styled.div`
  border-radius: 4px;
  background: linear-gradient(
    90deg,
    rgba(235, 238, 244, 0.8) 0%,
    rgba(235, 238, 244, 0.2) 100%
  );
`;

export default function AddressInfoLoading({ address }) {
  return (
    <>
      <Avatar address={address} size={40} />
      <div className="flex flex-col gap-2 w-full">
        <Skeleton className="h-[12px] w-[80px]" />
        <Skeleton className="h-[12px] w-[240px] max-w-full" />
      </div>
    </>
  );
}
