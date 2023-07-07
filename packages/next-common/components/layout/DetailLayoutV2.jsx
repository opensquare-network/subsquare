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
 * title: JSX.Element
 * titleHead: JSX.Element
 * header: JSX.Element
 * footer: JSX.Element
 * sider: JSX.Element
 * }} DetailLayoutProps
 */

/**
 * @param {DetailLayoutProps} props
 */
export default function DetailLayout({
  seoInfo,
  breadcrumbs,
  header,
  footer,
  sider,
  children,
}) {
  return (
    <BaseLayout seoInfo={seoInfo}>
      <div
        className={clsx(
          "bg-neutral100 px-6 flex-1 flex flex-col",
          "max-sm:px-0",
        )}
      >
        <div className={clsx("mx-auto py-6 max-w-[1200px] w-full")}>
          {!!breadcrumbs?.length && (
            <div className="mb-6 px-6">
              <Breadcrumb items={breadcrumbs} />
            </div>
          )}

          {header && <div className="px-6">{header}</div>}

          <div className="flex gap-x-6 mt-6 max-w-full">
            <div
              className={clsx(
                sider ? "max-w-[calc(100%-320px-24px)]" : "max-w-full",
                "max-sm:max-w-full",
              )}
            >
              {children}

              {sider && <div className={clsx("mt-6 sm:hidden")}>{sider}</div>}

              {footer}
            </div>

            {sider && (
              <div className={clsx("w-80 px-6 max-sm:hidden")}>{sider}</div>
            )}
          </div>
        </div>
      </div>
    </BaseLayout>
  );
}
