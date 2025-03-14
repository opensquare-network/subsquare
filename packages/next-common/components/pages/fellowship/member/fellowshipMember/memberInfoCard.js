import { cn } from "next-common/utils";
import MemberBaseInfo from "./base";
import Salary from "./salary";

export default function MemberInfoCard({ className, address }) {
  return (
    <div
      className={cn(
        "flex flex-col items-center p-[24px] bg-neutral100 rounded-[16px]",
        className,
      )}
    >
      <MemberBaseInfo address={address} />
      <Salary address={address} />
    </div>
  );
}
