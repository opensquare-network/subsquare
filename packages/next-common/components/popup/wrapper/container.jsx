import { cn } from "next-common/utils";

/**
 * @param {React.HTMLAttributes<HTMLDivElement>} props
 */
export default function PopupContainer(props) {
  return (
    <div
      {...props}
      className={cn(
        "fixed inset-0 bg-black/25 flex justify-center items-start overflow-auto overscroll-y-none",
        props.className,
      )}
    />
  );
}
