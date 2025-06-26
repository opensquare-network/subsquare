import Link from "next/link";
import { cn } from "next-common/utils";

export default function LinkButton({ children, className, ...props }) {
  return (
    <Link
      className={cn(
        "text-textPrimary text12Medium border border-neutral400 rounded-[6px] px-[11px] py-[5px] h-7 hover:border-neutral500",
        className,
      )}
      {...props}
    >
      {children}
    </Link>
  );
}
