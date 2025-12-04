import Link from "next-common/components/link";
import Tooltip from "next-common/components/tooltip";

export function AddressLink({ tooltip, href, label }) {
  return (
    <Link className="text12Medium" href={href} target="_blank" rel="noreferrer">
      <Tooltip content={tooltip} className="flex flex-nowrap whitespace-nowrap">
        <span className="text-textTertiary hover:underline">{label}</span>
        <i className="text-textTertiary">&nbsp;↗</i>
      </Tooltip>
    </Link>
  );
}

export default function AddressLinks({ items = [] }) {
  return (
    <div className="gap-x-1 grid grid-cols-3 max-sm:grid-cols-2">
      {items.map((item, index) => (
        <AddressLink
          key={index}
          label={item.label ?? `Addr #${index + 1}`}
          href={item.href}
          tooltip={item.tooltip ?? `Account #${index + 1}`}
        />
      ))}
    </div>
  );
}
