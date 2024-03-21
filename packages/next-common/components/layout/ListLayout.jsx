import { cn } from "next-common/utils";
import BaseLayout from "./baseLayout";
import Link from "next/link";
import { useRouter } from "next/router";
import { isExternalLink } from "next-common/utils";
import { noop } from "lodash-es";
import usePageTitle from "next-common/hooks/usePageTitle";
import Divider from "../styled/layout/divider";
import { isNil } from "lodash-es";

/**
 * @typedef {{
 *  label: string
 *  url?: string
 *  root?: string
 *  active?: boolean
 *  onClick?(): void
 *  urls?: string[]
 * }} Tab
 */

/**
 * @typedef {{
 * seoInfo?: Record<string, string>
 * children: JSX.Element
 * title: string
 * children: React.ReactNode
 * description: string
 * headContent?: JSX.Element
 * summary?: JSX.Element
 * summaryFooter?: JSX.Element
 * tabs?: Tab[]
 * }} ListLayoutProps
 */

/**
 * @param {ListLayoutProps} props
 */
export default function ListLayout({
  seoInfo: seoInfoProp = {},
  children,
  title,
  titleExtra,
  description,
  headContent,
  summary,
  summaryFooter,
  tabs = [],
  header,
}) {
  const seoTitle = usePageTitle(
    seoInfoProp.title ?? title ?? "governance platform",
  );

  const seoInfo = {
    title: "Subsquare | " + seoTitle,
    desc: description || seoInfoProp.desc,
  };

  const listHeader = (
    <div>
      <div className="flex justify-between">
        <h3 className="text20Bold text-textPrimary">{title}</h3>
        {titleExtra}
      </div>

      <p className="text14Medium text-textTertiary">{description}</p>

      {headContent && <div className="mt-2">{headContent}</div>}

      {summary && (
        <>
          <Divider className="my-4" />
          {summary}
        </>
      )}

      {summaryFooter && (
        <>
          <Divider className="my-4" />
          {summaryFooter}
        </>
      )}
    </div>
  );

  return (
    <BaseLayout seoInfo={seoInfo}>
      <div className="bg-neutral100 border-b border-neutral300">
        <div className={cn("px-12 py-6 mx-auto max-w-[1200px]", "max-sm:px-6")}>
          {header || listHeader}
        </div>

        {tabs?.length > 0 && (
          <div className={cn("px-12 mx-auto max-w-[1200px]", "max-sm:px-6")}>
            <Tabs tabs={tabs} />
          </div>
        )}
      </div>

      <div className="flex-1">
        <div className={cn("px-6 py-6 mx-auto max-w-[1200px]", "max-sm:px-0")}>
          {children}
        </div>
      </div>
    </BaseLayout>
  );
}

/**
 * @param {object} props
 * @param {Tab[]} props.tabs
 */
function Tabs({ tabs = [] }) {
  const router = useRouter();
  const routePath = router.asPath.split("?")[0];

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
            active = routePath.startsWith(tab.root || tab.url);
          } else {
            const urls = [tab.url, tab.root, ...(tab.urls || [])].filter(
              Boolean,
            );
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
