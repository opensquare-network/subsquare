import clsx from "clsx";
import BaseLayout from "./baseLayoutV2";
import Link from "next/link";
import { useRouter } from "next/router";
import { isExternalLink } from "next-common/utils";
import noop from "lodash.noop";

/**
 * @typedef {{
 *  label: string
 *  url?: string
 *  active?: boolean
 *  onClick?(): void
 * }} Tab
 */

/**
 * @typedef {{
 * seoInfo?: Record<string, string>
 * children: JSX.Element
 * title: string
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
  seoInfo = {},
  children,
  title,
  description,
  headContent,
  summary,
  summaryFooter,
  tabs = [],
}) {
  return (
    <BaseLayout seoInfo={seoInfo}>
      <div className="bg-neutral100">
        <div className={clsx("px-12 py-6 mx-auto max-w-7xl", "max-sm:px-0")}>
          <div>
            <div className="flex justify-between items-baseline">
              <h3 className="text20Bold text-textPrimary">{title}</h3>
            </div>

            <p className="text14Medium text-textTertiary">{description}</p>

            {headContent && <div className="mt-2">{headContent}</div>}

            {summary && (
              <>
                <hr className="h-px my-4 bg-neutral300" />
                {summary}
              </>
            )}

            {summaryFooter && (
              <>
                <hr className="h-px my-4 bg-neutral300" />
                {summaryFooter}
              </>
            )}
          </div>
        </div>
        {tabs?.length > 0 && <Tabs tabs={tabs} />}
      </div>

      <div className={clsx("px-6 my-6 mx-auto max-w-7xl", "max-sm:px-0")}>
        {children}
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

  return (
    <ul className="flex space-x-8 px-12">
      {tabs.map((tab, idx) => {
        const isExternal = isExternalLink(tab.url);
        const itemClassName = clsx(
          "block pb-3",
          "text14Bold border-b-4 text-textPrimary",
          "hover:text-theme500",
        );
        const itemActiveClassName = "border-theme500 text-theme500";

        return (
          <li key={idx}>
            {tab.url ? (
              <Link
                href={tab.url}
                target={isExternal ? "_blank" : "_self"}
                className={clsx(
                  itemClassName,
                  tab.active || router.asPath.startsWith(tab.url)
                    ? itemActiveClassName
                    : "border-transparent",
                )}
              >
                {tab.label}
                {isExternal && (
                  <span className="ml-1 text-textTertiary text14Medium">↗</span>
                )}
              </Link>
            ) : (
              <div
                role="button"
                className={clsx(
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
