import clsx from "clsx";
import BaseLayout from "./baseLayoutV2";
import Breadcrumb from "../_Breadcrumb";
import { useSelector } from "react-redux";
import {
  layoutDetailSidebarHeight,
  setLayoutDetailSidebarHeight,
} from "next-common/store/reducers/layoutSlice";
import { useEffect } from "react";
import { useDispatch } from "react-redux";
import { useNavCollapsed } from "next-common/context/nav";
import { NeutralPanel } from "../styled/containers/neutralPanel";

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
 * @typedef {Object} DetailLayoutProps
 * @property {JSX.Element | Breadcrumb[]} breadcrumbs - The breadcrumb items.
 * @property {SeoInfo} seoInfo - The SEO information.
 * @property {JSX.Element} children - The children components.
 * @property {JSX.Element} header - The header element.
 * @property {boolean} hasSidebar - Indicates if the layout has a sidebar component.
 */

/**
 * @param {DetailLayoutProps} props
 */
export default function DetailLayout({
  seoInfo,
  breadcrumbs,
  header,
  children,
  hasSidebar,
}) {
  const dispatch = useDispatch();
  const sidebarHeight = useSelector(layoutDetailSidebarHeight);
  useEffect(() => {
    return () => {
      dispatch(setLayoutDetailSidebarHeight(0));
    };
  }, []);

  const [navCollapsed] = useNavCollapsed();

  return (
    <BaseLayout seoInfo={seoInfo}>
      <div
        className={clsx(
          "bg-neutral200 px-6 flex-1 flex flex-col",
          "max-sm:px-0",
          // navCollapsed ? "max-md:px-0" : "max-lg:px-0",
        )}
      >
        <div
          className={clsx(
            "mx-auto py-6 max-w-[1200px] w-full",
            !hasSidebar && "max-w-[856px]",
          )}
        >
          {breadcrumbs && (
            <div
              className={clsx(
                "mb-6 px-12",
                navCollapsed ? "max-md:px-6" : "max-lg:px-6",
              )}
            >
              {breadcrumbs?.length > 0 ? (
                <Breadcrumb items={breadcrumbs} />
              ) : (
                breadcrumbs
              )}
            </div>
          )}

          {header && (
            <div
              className={clsx(
                "px-12",
                navCollapsed ? "max-md:px-6" : "max-lg:px-6",
              )}
            >
              {header}
            </div>
          )}

          {/* set relative for right side(vote) component */}
          <div className="flex gap-x-6 mt-6 max-w-full relative">
            <div
              className={clsx(
                "w-full",
                hasSidebar ? "max-w-[calc(100%-320px-48px)]" : "max-w-full",
                navCollapsed ? "max-md:max-w-full" : "max-lg:max-w-full",
              )}
              style={{ minHeight: `${sidebarHeight}px` }}
            >
              <NeutralPanel
                className={clsx(
                  "w-full flex flex-col gap-y-12 p-12 max-sm:gap-y-4",
                  "max-sm:!rounded-none",
                  navCollapsed ? "max-md:p-6" : "max-lg:p-6",
                )}
              >
                {children}
              </NeutralPanel>
            </div>
          </div>
        </div>
      </div>
    </BaseLayout>
  );
}
