import { isNil } from "lodash-es";
import ReasonLink from "../reasonLink";
import Link from "next/link";
import { cn, isExternalLink } from "next-common/utils";
import React from "react";
export default function ListPostTitle({
  data = {},
  href,
  className = "",
  ellipsis = false,
}) {
  let title = data.title?.trim() || "--";

  return (
    <p
      title={title}
      className={cn(
        "flex-1 overflow-hidden text-textPrimary text16Medium",
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
      <ReasonLink text={data.title} hideText={true} />
    </p>
  );
}
