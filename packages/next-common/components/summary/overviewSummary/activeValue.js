import React from "react";
import Tooltip from "../../tooltip";
import Link from "next/link";

export default function ActiveValue({ tooltip, href, value }) {
  return (
    <Tooltip content={tooltip}>
      <Link
        href={href}
        className="ml-1 cursor-pointer text16Bold hover:underline"
      >
        {value}
      </Link>
    </Tooltip>
  );
}
