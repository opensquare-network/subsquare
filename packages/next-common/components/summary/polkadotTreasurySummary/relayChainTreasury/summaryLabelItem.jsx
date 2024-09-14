export default function SummaryLabelItem({ label, suffix, children }) {
  return (
    <div className="inline-flex !items-center text12Medium text-textTertiary gap-x-1 whitespace-nowrap">
      {label}
      <span className="inline-flex items-center space-x-1">{children}</span>
      {suffix}
    </div>
  );
}
