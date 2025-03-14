import Avatar from "next-common/components/avatar";
import AccountLinks from "next-common/components/links/accountLinks";
import { cn } from "next-common/utils";

function BaseInfo({ address }) {
  return (
    <div className="flex flex-col items-center p-[24px] pt-[16px] gap-[16px]">
      <Avatar address={address} size={56} />
      <div className="flex flex-col items-center gap-[4px]">
        <span className="text-textPrimary text20Bold">Carli_Fritsch</span>
        <span className="text12Medium text-textTertiary">16SD...qHna</span>
        <AccountLinks address={address} />
      </div>
      <div className="text12Medium py-[4px] px-[8px] rounded-[4px] bg-[#B276EA25] text-[#B276EA]">
        Fellowship #4
      </div>
    </div>
  );
}

export default function MemberInfoCard({ className, address }) {
  return (
    <div
      className={cn(
        "flex justify-center p-[24px] bg-neutral100 rounded-[16px]",
        className,
      )}
    >
      <BaseInfo address={address} />
    </div>
  );
}
