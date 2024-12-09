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
  shallow,
}) {
  const isFunctionLabel = isFunction(label);
  const isStringLabel = isValidElement(label);

  let content = (
    <div
      role={isStringLabel ? "tab" : null}
      onClick={onClick}
      className={cn(
        !isFunctionLabel && !isStringLabel
          ? cn(
              "cursor-pointer",
              "pb-3",
              "text14Bold border-b-4 text-textPrimary whitespace-nowrap",
              "hover:text-theme500",
              "flex items-center",
              className,
              active ? "border-theme500 text-theme500" : "border-transparent",
            )
          : className,
      )}
    >
      <>
        {isFunction(label) ? label({ active }) : label}
        {!!activeCount && (
          <span className="ml-1 text-textTertiary text14Medium">
            {activeCount}
          </span>
        )}
        {labelExtra}
      </>
    </div>
  );

  if (url) {
    content = (
      <Link
        href={url}
        target={isExternalLink(url) ? "_blank" : "_self"}
        shallow={shallow}
      >
        {content}
      </Link>
    );
  }

  return <Tooltip content={tooltip}>{content}</Tooltip>;
}
