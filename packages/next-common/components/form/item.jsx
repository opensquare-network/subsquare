import { cn } from "next-common/utils";

/**
 * Render a form item with a label, optional extra label, and children.
 *
 * @param {Object} props - The props object.
 * @param {string} props.label - The label for the form item.
 * @param {string} props.className - The className for the form item.
 * @param {string | JSX.Element} [props.labelExtra] - An optional extra label for the form item.
 * @param {string | JSX.Element} [props.labelExternal] - An optional extra label for the form item.
 * @param {JSX.Element} props.children - The children of the form item.
 * @return {JSX.Element} - The rendered form item.
 */
function FormItem({
  label,
  labelExternal,
  labelExtra,
  children,
  className = "",
}) {
  return (
    <div className={cn("mb-4 last:mb-0", className)}>
      <div className="flex items-end justify-between mb-4">
        <div className="text14Bold text-textPrimary">{label}</div>
        {(labelExtra || labelExternal) && (
          <div className="text12Bold">{labelExtra || labelExternal}</div>
        )}
      </div>
      {children}
    </div>
  );
}

export default FormItem;
