import BreadcrumbItem from "./BreadcrumbItem";
import clsx from "clsx";

/**
 * @param {import('./types').BreadcrumbProps} props
 */
function Breadcrumb(props) {
  const { separator = "/", className, items, ...restProps } = props;

  return (
    <ul {...restProps} className={clsx("flex items-center", className)}>
      {items?.map?.((item, idx) => (
        <BreadcrumbItem key={idx} path={item.path} separator={separator}>
          {item.content}
        </BreadcrumbItem>
      ))}
    </ul>
  );
}

export default Breadcrumb;
