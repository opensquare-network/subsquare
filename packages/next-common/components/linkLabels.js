import React from "react";
import Link from "next/link";

export default function LinkLabels({ labels = [] }) {
  return (
    <div className="flex items-center gap-x-2">
      {labels.map(({ label, link }) => (
        <Link
          key={label}
          href={link}
          className="flex cursor-pointer px-2 py-0.5 text12Medium text-textSecondary border border-neutral400 rounded-xl"
        >
          {label}
        </Link>
      ))}
    </div>
  );
}
