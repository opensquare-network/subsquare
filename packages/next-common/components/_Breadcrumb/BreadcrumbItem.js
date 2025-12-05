import Link from "next-common/components/link";
import { cn } from "next-common/utils";

/**
 * @param {import('./types').BreadcrumbItemProps} props
 */
function BreadcrumbItem(props) {
  const { children, separator = "/", path, className = "" } = props ?? {};

  let content = children;
  if (path) {
    content = (
      <Link href={path} className="hover:underline">
        {content}
      </Link>
    );
  }

  if (!children) {
    return null;
  }

  return (
    <li
      className={cn(
        "group",
        "[&:not(:last-child)]:min-w-fit",
        "text14Medium text-textPrimary last:text-textTertiary",
        "overflow-hidden whitespace-nowrap overflow-ellipsis",
        className,
      )}
    >
      <span>{content}</span>

      {separator && (
        <span className="text-textDisabled mx-2 group-last:hidden">
          {separator}
        </span>
      )}
    </li>
  );
}

export default BreadcrumbItem;
