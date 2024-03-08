// https://ant.design/components/tag-cn#tag-demo-checkable
// checkable

import { cn } from "next-common/utils";
import { BaseTag, ThemedTag } from "./state/styled";
import noop from "lodash.noop";

export default function CheckableTag({
  checked,
  count,
  className = "",
  children,
  role = "button",
  onClick = noop,
  ...props
}) {
  const Tag = checked ? ThemedTag : BaseTag;

  return (
    <Tag
      role={role}
      className={cn(!checked && "bg-neutral200 !text-textPrimary", className)}
      onClick={onClick}
      {...props}
    >
      {children}
      <span
        className={cn("ml-1", checked ? "text-theme300" : "text-textTertiary")}
      >
        {count}
      </span>
    </Tag>
  );
}
