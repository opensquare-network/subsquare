import Link from "next/link";

export default function SummaryLabelLinkItem({ label, href, children }) {
  return (
    <div className="flex gap-[4px]">
      <Link
        className="text12Medium"
        href={href}
        target="_blank"
        rel="noreferrer"
      >
        <span className="text-textTertiary hover:underline">{label}</span>
        <i className="text-textTertiary">&nbsp;↗</i>
      </Link>
      <div className="flex">{children}</div>
    </div>
  );
}
