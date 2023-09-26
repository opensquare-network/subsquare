import Link from "next/link";
import clsx from "clsx";

/**
 * @param {import('./types').BreadcrumbItemProps} props
 */
function BreadcrumbItem(props) {
  const { children, separator = "/", path } = props ?? {};

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
      className={clsx(
        "group",
        "[&:not(:last-child)]:min-w-fit",
        "text14Medium text-textPrimary last:text-textTertiary",
        "overflow-hidden whitespace-nowrap overflow-ellipsis",
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
