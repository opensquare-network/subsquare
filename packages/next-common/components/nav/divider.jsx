import { cn } from "next-common/utils";

export default function NavMenuDivider({ className }) {
  return <hr className={cn("border-navigationBorder  my-2 mx-2", className)} />;
}
