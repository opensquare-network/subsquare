import { cn } from "next-common/utils";
import BaseLayout from "../baseLayout";
import { useDispatch, useSelector } from "react-redux";
import {
  layoutDetailSidebarHeight,
  setLayoutDetailSidebarHeight,
} from "next-common/store/reducers/layoutSlice";
import { useEffect } from "react";
import { useNavCollapsed } from "next-common/context/nav";
import { NeutralPanel } from "../../styled/containers/neutralPanel";
import Breadcrumbs from "next-common/components/layout/DetailLayout/breadcrumbs";
import ScrollToTopButton from "next-common/components/layout/DetailLayout/ScrollToTopButton";

export default function DetailLayout({
  seoInfo,
  breadcrumbs,
  children,
  hasSidebar,
}) {
  const dispatch = useDispatch();
  const sidebarHeight = useSelector(layoutDetailSidebarHeight);
  useEffect(() => {
    return () => {
      dispatch(setLayoutDetailSidebarHeight(0));
    };
  }, [dispatch]);

  const [navCollapsed] = useNavCollapsed();

  return (
    <BaseLayout seoInfo={seoInfo}>
      <div
        className={cn(
          "bg-pageBg px-6 flex-1 flex flex-col",
          "max-sm:px-0",
          // navCollapsed ? "max-md:px-0" : "max-lg:px-0",
        )}
      >
        <div
          className={cn(
            "mx-auto py-6 max-w-[1200px] w-full",
            !hasSidebar && "max-w-[856px]",
          )}
        >
          <Breadcrumbs breadcrumbs={breadcrumbs} hasSidebar={hasSidebar} />

          {/*Click the floating window button and slide to the top of the browser*/}
          <ScrollToTopButton />

          {/* set relative for right side(vote) component */}
          <div className="flex gap-x-6 max-w-full relative">
            <div
              className={cn(
                "w-full",
                hasSidebar ? "max-w-[calc(100%-320px-24px)]" : "max-w-full",
                navCollapsed ? "max-md:max-w-full" : "max-lg:max-w-full",
              )}
              style={{ minHeight: `${sidebarHeight}px` }}
            >
              <NeutralPanel
                className={cn(
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
