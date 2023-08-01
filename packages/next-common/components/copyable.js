import CopyButton from "./copyButton";

export default function Copyable({ children, copyText = "" }) {
  return (
    <span>
      {children}
      <div className="inline-flex ml-[8px] relative top-[3px]">
        <CopyButton copyText={copyText || children} />
      </div>
    </span>
  );
}
