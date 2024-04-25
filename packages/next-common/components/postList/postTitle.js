import { isNil } from "lodash-es";
import ReasonLink from "../reasonLink";
import Link from "next/link";
import { cn, isExternalLink } from "next-common/utils";
import React from "react";
import Tooltip from "next-common/components/tooltip";
import WarningIcon from "next-common/assets/imgs/icons/warning.svg";
export default function ListPostTitle({
  data = {},
  href,
  className = "",
  ellipsis = false,
}) {
  let title = data.title?.trim() || "--";

  return (
    <div
      title={title}
      className={cn(
        "flex-1 overflow-hidden text-textPrimary text16Medium align-middle",
        ellipsis && "flex",
        className,
      )}
    >
      {!isNil(data?.index) && (
        <span className="after:content-['·'] after:mx-2 after:text-textTertiary">{`#${data.index}`}</span>
      )}

      <Link
        href={href}
        target={isExternalLink(href) ? "_blank" : null}
        className={cn(
          "cursor-pointer hover:underline",
          ellipsis && "!break-all line-clamp-1",
        )}
        style={{ wordBreak: "break-word" }}
      >
        {title}
      </Link>
      {data?.isMalicious && (
        <Tooltip
          className="align-middle ml-2 mt-[2px]"
          content="Warning: Malicious proposal!"
        >
          <WarningIcon className="align-middle" />
        </Tooltip>
      )}
      <ReasonLink text={data.title} hideText={true} />
    </div>
  );
}
