import { cn } from "next-common/utils";

/**
 * @param {import("react").HTMLAttributes<HTMLDivElement>} props
 */
export default function CoreFellowshipMemberInfoWrapper({
  children,
  className,
  ...props
}) {
  return (
    <div className={cn("grow truncate basis-1/2", className)} {...props}>
      {children}
    </div>
  );
}
