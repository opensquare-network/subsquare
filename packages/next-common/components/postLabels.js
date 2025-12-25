import React from "react";
import Link from "next-common/components/link";

export default function PostLabels({ labels = [] }) {
  if (!labels || labels.length <= 0) {
    return null;
  }

  return (
    <div className="flex items-center gap-x-2">
      {labels.map((item) => (
        <Link
          key={item}
          href={`/discussions?label=${encodeURIComponent(item)}`}
          className="flex cursor-pointer px-2 py-0.5 text12Medium text-textSecondary border border-neutral400 rounded-xl"
        >
          {item}
        </Link>
      ))}
    </div>
  );
}
