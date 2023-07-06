// https://ant.design/components/descriptions, Display multiple read-only fields in groups.

import clsx from "clsx";

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
  return (
    <div className="w-full">
      {title && <h4 className="text14Bold text-textPrimary">{title}</h4>}

      {!!items?.length && (
        <div className="mt-2">
          {items.map((item, idx) => (
            <div
              key={idx}
              className={clsx(
                "py-4 first:pt-0 last:pb-0",
                "flex items-center",
                "border-t border-neutral300 first:border-none",
                "max-sm:block",
              )}
            >
              {item.content ?? (
                <>
                  <div
                    className="text-textPrimary text14Medium"
                    style={{ width: item.labelWidth || labelWidth }}
                  >
                    {item.label}
                  </div>
                  <div
                    className={clsx(
                      "text-textPrimary text14Medium break-words",
                      "flex-1 flex",
                      valueAlign === "right" && "justify-end",
                      valueAlign === "left" && "justify-start",
                      "max-sm:mt-2",
                    )}
                  >
                    {item.value}
                  </div>
                </>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
