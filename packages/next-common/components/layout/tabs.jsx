import { cn } from "next-common/utils";
import Link from "next/link";
import { isExternalLink } from "next-common/utils";
import noop from "lodash.noop";
import isNil from "lodash.isnil";
import { usePageUrl } from "next-common/context/nav/route";
/**
 * @param {object} props
 * @param {Tab[]} props.tabs
 */
export default function Tabs({ tabs = [] }) {
  const url = usePageUrl();
  const routePath = url.split("?")[0];

  return (
    <ul className="flex space-x-6">
      {tabs.map((tab, idx) => {
        const isExternal = isExternalLink(tab.url);
        const itemClassName = cn(
          "block pb-3",
          "text14Bold border-b-4 text-textPrimary",
          "hover:text-theme500",
        );
        const itemActiveClassName = "border-theme500 text-theme500";

        let active = tab.active;
        if (isNil(active)) {
          if (tab.exactMatch === false) {
            active = routePath.startsWith(tab.url);
          } else {
            const urls = [
              tab.url,
              ...(tab.extraMatchTabActivePathnames ?? []),
              ...(tab.urls || []),
            ];
            active = urls.includes(routePath);
          }
        }

        return (
          <li key={idx}>
            {tab.url ? (
              <Link
                href={tab.url}
                target={isExternal ? "_blank" : "_self"}
                className={cn(
                  itemClassName,
                  active ? itemActiveClassName : "border-transparent",
                )}
              >
                {tab.label}
                {isExternal && (
                  <span className="ml-1 text-textTertiary text14Medium">
                    ↗
                  </span>
                )}
                {!isNil(tab.count) && (
                  <span className="text-textTertiary mx-1 text14Medium">
                    {tab.count || 0}
                  </span>
                )}
              </Link>
            ) : (
              <div
                role="button"
                className={cn(
                  itemClassName,
                  tab.active ? itemActiveClassName : "border-transparent",
                )}
                onClick={tab.onClick ?? noop}
              >
                {tab.label}
              </div>
            )}
          </li>
        );
      })}
    </ul>
  );
}
