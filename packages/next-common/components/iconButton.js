import { cn } from "next-common/utils";

export default function IconButton({ children, className, ...props }) {
  return (
    <div className={cn("cursor-pointer", className)} {...props}>
      {children}
    </div>
  );
}
