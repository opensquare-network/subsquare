// https://ant.design/components/descriptions, Display multiple read-only fields in groups.

import clsx from "clsx";
import { useNavCollapsed } from "next-common/context/nav";

/**
 * @param {Object} props
 * @param {{label: string, labelWidth?: number, value: JSX.Element, content?: JSX.Element}[]} props.items
 * @param {number} props.labelWidth
 * @param {'left' | 'right'} props.valueAlign
 */
export default function Descriptions({
  title = "",
  items = [],
  labelWidth,
  valueAlign = "right",
}) {
  const [navCollapsed] = useNavCollapsed();

  return (
    <div className="w-full">
      {title && <h4 className="text14Bold text-textPrimary mb-2">{title}</h4>}

      {!!items?.length && (
        <div>
          {items.map((item, idx) => (
            <div
              key={idx}
              className={clsx(
                "py-4 first:pt-0 last:pb-0",
                "flex items-center",
                "border-t border-neutral300 first:border-none",
                navCollapsed ? "max-sm:block" : "max-md:block",
              )}
            >
              <div className="w-full">
                <div
                  className={clsx(
                    "flex items-center",
                    navCollapsed ? "max-sm:block" : "max-md:block",
                  )}
                >
                  <div
                    className="text-textSecondary text14Medium"
                    style={{ width: item.labelWidth || labelWidth }}
                  >
                    {item.label}
                  </div>
                  <div
                    className={clsx(
                      "text-textPrimary text14Medium break-all",
                      "flex-1 flex",
                      valueAlign === "right" && "justify-end",
                      valueAlign === "left" && "justify-start",
                      navCollapsed ? "max-sm:mt-2" : "max-md:mt-2",
                    )}
                  >
                    {item.value}
                  </div>
                </div>
                {item.content}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
