import clsx from "clsx";
import BaseLayout from "./baseLayoutV2";
import Breadcrumb from "../_Breadcrumb";
import { useSelector } from "react-redux";
import {
  layoutDetailSiderHeight,
  setLayoutDetailSiderHeight,
} from "next-common/store/reducers/layoutSlice";
import { useEffect } from "react";
import { useDispatch } from "react-redux";
import { useNavCollapsed } from "next-common/context/nav";

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
 * @property {Object} detail - The post detail from server.
 * @property {JSX.Element} children - The children components.
 * @property {JSX.Element} header - The header element.
 * @property {boolean} hasSider - Indicates if the layout has a sider component.
 */

/**
 * @param {DetailLayoutProps} props
 */
export default function DetailLayout({
  seoInfo,
  breadcrumbs,
  header,
  children,
  hasSider,
  detail,
}) {
  const dispatch = useDispatch();
  const siderHeight = useSelector(layoutDetailSiderHeight);
  useEffect(() => {
    return () => {
      dispatch(setLayoutDetailSiderHeight(0));
    };
  }, []);

  const [navCollapsed] = useNavCollapsed();

  return (
    <BaseLayout seoInfo={seoInfo}>
      <div
        className={clsx(
          "bg-neutral100 px-6 flex-1 flex flex-col",
          "max-sm:px-0",
        )}
      >
        <div className={clsx("mx-auto py-6 max-w-[1200px] w-full")}>
          {breadcrumbs && (
            <div className="mb-6 px-6">
              {breadcrumbs?.length > 0 ? (
                <Breadcrumb items={breadcrumbs} />
              ) : (
                breadcrumbs
              )}
            </div>
          )}

          {header && <div className="px-6">{header}</div>}

          {/* set relative for right side(vote) component */}
          <div className="flex gap-x-6 mt-6 max-w-full relative">
            <div
              className={clsx(
                "w-full space-y-6 max-sm:space-y-4",
                detail && hasSider
                  ? "max-w-[calc(100%-320px-48px)]"
                  : "max-w-full",
                navCollapsed ? "max-md:max-w-full" : "max-lg:max-w-full",
              )}
              style={{ minHeight: `${siderHeight}px` }}
            >
              {children}
            </div>
          </div>
        </div>
      </div>
    </BaseLayout>
  );
}
