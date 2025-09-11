import clsx from "clsx";
import CopyButton from "./copyButton";

export default function Copyable({ children, className, copyText = "", size }) {
  return (
    <span className={clsx("break-all", className)}>
      {children}
      <div className="inline-flex ml-[8px] relative align-middle">
        <CopyButton copyText={copyText || children} size={size} />
      </div>
    </span>
  );
}
