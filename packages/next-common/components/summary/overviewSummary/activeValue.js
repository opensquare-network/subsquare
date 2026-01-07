import React from "react";
import Tooltip from "../../tooltip";
import Link from "next-common/components/link";

export default function ActiveValue({ tooltip, href, value }) {
  return (
    <Tooltip content={tooltip}>
      <Link href={href} className="cursor-pointer text16Bold hover:underline">
        {value}
      </Link>
    </Tooltip>
  );
}
