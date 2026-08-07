import Link from "next-common/components/link";
import Tooltip from "next-common/components/tooltip";
import { addressEllipsis } from "next-common/utils";

export const colAccount = {
  name: "Account",
  style: { textAlign: "left", width: "140px", minWidth: "140px" },
  render: (item) => (
    <Link
      href={`/user/${item.owner}`}
      className="text14Medium text-theme500 hover:text-theme500"
    >
      <Tooltip content={item.owner}>{addressEllipsis(item.owner)}</Tooltip>
    </Link>
  ),
};
