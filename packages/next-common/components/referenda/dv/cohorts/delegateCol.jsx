import Link from "next/link";
import { LinkMedium } from "@osn/icons/subsquare";
import { isNil } from "lodash-es";
import BigNumber from "bignumber.js";

export default function DelegateCol({ row }) {
  if (isNil(row)) {
    return null;
  }

  const count = BigNumber(row.delegateCnt)
    .plus(row.guardianCnt || 0)
    .toString();

  return (
    <span className="flex items-center justify-end gap-x-1">
      {count}
      {row.announcementLink && (
        <Link
          target="_blank"
          href={row.announcementLink}
          className="[&_path]:fill-textTertiary [&_path]:hover:fill-textSecondary"
        >
          <LinkMedium className="w-5 h-5" />
        </Link>
      )}
    </span>
  );
}
