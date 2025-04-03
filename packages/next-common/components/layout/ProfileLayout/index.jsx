import { cn } from "next-common/utils";
import BaseLayout from "../baseLayout";
import usePageTitle from "next-common/hooks/usePageTitle";
import Divider from "../../styled/layout/divider";
import TabsList from "../../tabs/list";

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
 * }} ProfileLayoutProps
 */

/**
 * @param {ProfileLayoutProps} props
 */
export default function ProfileLayout({
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
  pageHeader,
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
      <div className="flex justify-between w-full max-sm:flex-col-reverse max-sm:gap-y-3">
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
    <BaseLayout
      seoInfo={seoInfo}
      contentStyle={{
        backgroundImage: "linear-gradient(180deg, rgba(253, 253, 253, 1), rgba(246, 247, 250, 1))",
      }}
    >
      {pageHeader && (
        <div className={cn("px-0 py-0 mx-auto w-full h-[120px] relative")}>
          {pageHeader}
        </div>
      )}
      <div className="border-b border-neutral300">
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
