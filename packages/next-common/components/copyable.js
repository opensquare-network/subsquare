import CopyButton from "./copyButton";

export default function Copyable({ children, copyText = "", size }) {
  return (
    <span>
      {children}
      <div className="inline-flex ml-[8px] relative top-[2px]">
        <CopyButton copyText={copyText || children} size={size} />
      </div>
    </span>
  );
}
