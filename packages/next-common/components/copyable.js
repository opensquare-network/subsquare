import clsx from "clsx";
import CopyButton from "./copyButton";

export default function Copyable({
  children,
  className,
  title,
  copyText = "",
  size,
}) {
  return (
    <span className={clsx("break-all", className)} title={title}>
      {children}
      <div className="inline-flex ml-[8px] relative align-middle">
        <CopyButton copyText={copyText || children} size={size} />
      </div>
    </span>
  );
}
