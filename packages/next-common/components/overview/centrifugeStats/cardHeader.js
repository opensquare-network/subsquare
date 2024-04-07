export default function CardHeader({ title, value }) {
  return (
    <div className="flex flex-col gap-[4px]">
      <div className="text12Medium text-textTertiary">{title}</div>
      <div className="text16Bold text-textPrimary">{value}</div>
    </div>
  );
}
