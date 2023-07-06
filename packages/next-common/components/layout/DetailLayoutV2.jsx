import clsx from "clsx";
import BaseLayout from "./baseLayoutV2";
import Breadcrumb from "../_Breadcrumb";

/**
 * @typedef {{
 * content: string | import("react").ReactNode
 * path?: string
 * }} Breadcrumb
 */

/**
 * @typedef {{
 * title: string
 * desc?: string
 * }} SeoInfo
 */

/**
 * @typedef {{
 * breadcrumbs: Breadcrumb[]
 * seoInfo?: SeoInfo
 * children: JSX.Element
 * side: JSX.Element
 * title: JSX.Element
 * titleHead: JSX.Element
 * head: JSX.Element
 * meta: JSX.Element
 * }} DetailLayoutProps
 */

/**
 * @param {DetailLayoutProps} props
 */
export default function DetailLayout({
  seoInfo,
  breadcrumbs,
  side,
  head,
  children,
}) {
  return (
    <BaseLayout seoInfo={seoInfo}>
      <div className="bg-neutral100 px-6">
        <div className={clsx("mx-auto max-w-[1200px] w-full py-6")}>
          {!!breadcrumbs?.length && (
            <div className="mb-6 px-6">
              <Breadcrumb items={breadcrumbs} />
            </div>
          )}

          {head && <div className="px-6">{head}</div>}

          <div className="flex gap-x-6 mt-6 max-w-full">
            <div className="w-full">{children}</div>

            {side && <div className={clsx("w-80 px-6")}>{side}</div>}
          </div>
        </div>
      </div>
    </BaseLayout>
  );
}
