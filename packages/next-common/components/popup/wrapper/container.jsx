import { cn } from "next-common/utils";
import { forwardRef } from "react";

/**
 * @param {React.HTMLAttributes<HTMLDivElement>} props
 */
function PopupContainer(props, ref) {
  return (
    <div
      {...props}
      ref={ref}
      className={cn(
        "fixed inset-0 bg-[#000000]/25 flex justify-center items-start overflow-auto overscroll-y-none",
        props.className,
      )}
    />
  );
}

export default forwardRef(PopupContainer);
