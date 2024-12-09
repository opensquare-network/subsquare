import { isFunction } from "lodash-es";
import Tooltip from "next-common/components/tooltip";
import { cn, isExternalLink } from "next-common/utils";
import Link from "next/link";
import { isValidElement } from "react";

export default function TabsListItem({
  tooltip,
  label,
  labelExtra,
  className = "",
  active,
  activeCount,
  onClick,
  url = "",
}) {
  let content;
  if (isFunction(label)) {
    content = label({ active });
  } else {
    const isElement = isValidElement(label);

    content = (
      <div
        role={isElement ? null : "tab"}
        className={cn(
          "cursor-pointer",
          "pb-3",
          "text14Bold border-b-4 text-textPrimary whitespace-nowrap",
          "hover:text-theme500",
          "flex items-center",
          className,
          active ? "border-theme500 text-theme500" : "border-transparent",
        )}
        onClick={onClick}
      >
        {label}
        {!!activeCount && (
          <span className="ml-1 text-textTertiary text14Medium">
            {activeCount}
          </span>
        )}
        {labelExtra}
      </div>
    );
  }

  if (url) {
    content = (
      <Link href={url} target={isExternalLink(url) ? "_blank" : "_self"}>
        {content}
      </Link>
    );
  }

  return <Tooltip content={tooltip}>{content}</Tooltip>;
}
