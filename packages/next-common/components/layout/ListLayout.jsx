import { cn } from "next-common/utils";
import BaseLayout from "./baseLayout";
import usePageTitle from "next-common/hooks/usePageTitle";
import Divider from "../styled/layout/divider";
import TabsList from "../tabs/list";

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
            <TabsList tabs={tabs} />
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
