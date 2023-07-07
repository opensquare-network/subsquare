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
 * @param {Object} props
 * @param {Breadcrumb[]} props.breadcrumbs - The breadcrumb items.
 * @param {SeoInfo} props.seoInfo - The SEO information.
 * @param {JSX.Element} props.children - The children components.
 * @param {JSX.Element} props.title - The title element.
 * @param {JSX.Element} props.titleHead - The title head element.
 * @param {JSX.Element} props.header - The header element.
 * @param {boolean} props.hasSider - Indicates if the layout has a sider component.
 */

export default function DetailLayout({
  seoInfo,
  breadcrumbs,
  header,
  children,
  hasSider,
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

          {/* set relative for right side(vote) component */}
          <div className="flex gap-x-6 mt-6 max-w-full relative">
            <div
              className={clsx(
                hasSider ? "max-w-[calc(100%-320px-24px)]" : "max-w-full",
                "max-sm:max-w-full",
              )}
            >
              {children}
            </div>
          </div>
        </div>
      </div>
    </BaseLayout>
  );
}
