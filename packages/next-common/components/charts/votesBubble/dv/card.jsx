import AddressUser from "next-common/components/user/addressUser";
import { cn } from "next-common/utils";

// TODO: unvote
export default function DVDelegateCard({ address, type = "" }) {
  return (
    <div
      className={cn(
        "grid grid-cols-2",
        "max-sm:grid-cols-1 max-sm:gap-y-2",
        "text14Medium",
        "w-full rounded-lg",
        "py-2.5 px-4",
        type === "aye" && "bg-green100 text-green500",
        type === "nay" && "bg-red100 text-red500",
        type === "abstain" && "bg-neutral200 text-textSecondary",
        type === "unvote" && "bg-neutral200 text-textDisabled",
      )}
    >
      <AddressUser add={address} />

      <div className="flex justify-between">
        <span className="capitalize">{type} (12%)</span>
        <span>TODO</span>
      </div>
    </div>
  );
}
