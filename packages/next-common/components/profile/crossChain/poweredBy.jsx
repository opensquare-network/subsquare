import Link from "next-common/components/link";

export default function PoweredBy() {
  return (
    <div className="flex items-center gap-x-1 text-[10px] text-textTertiary">
      Data is powered by
      <Link
        href="https://www.ocelloids.net/"
        target="_blank"
        rel="noreferrer"
        className="font-semibold text-textSecondary hover:text-textPrimary"
      >
        Ocelloids
      </Link>
    </div>
  );
}
