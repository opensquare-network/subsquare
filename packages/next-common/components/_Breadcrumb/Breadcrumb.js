import BreadcrumbItem from "./BreadcrumbItem";
import { cn } from "next-common/utils";

/**
 * @param {import('./types').BreadcrumbProps} props
 */
function Breadcrumb(props) {
  const { separator = "/", className, items, ...restProps } = props;

  return (
    <ul {...restProps} className={cn("flex items-center", className)}>
      {items?.map?.((item, idx) => (
        <BreadcrumbItem
          key={idx}
          path={item.path}
          className={item.className}
          separator={separator}
        >
          {item.content}
        </BreadcrumbItem>
      ))}
    </ul>
  );
}

export default Breadcrumb;
