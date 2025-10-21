import { cn } from "next-common/utils";
import BaseLayout from "../baseLayout";
import { useEffect } from "react";
import { useNavCollapsed } from "next-common/context/nav";
import { NeutralPanel } from "../../styled/containers/neutralPanel";
import Breadcrumbs from "next-common/components/layout/DetailLayout/breadcrumbs";
import ScrollToTopButton from "next-common/components/layout/DetailLayout/ScrollToTopButton";
import { useLayoutSidebarHeight } from "../sidebar/rightBarWrapper";

export default function ReferendaDetailLayout({
  seoInfo,
  breadcrumbs,
  children,
  hasSidebar,
}) {
  return (
    <BaseLayout seoInfo={seoInfo}>
      <div className={cn("bg-pageBg px-6 flex-1 flex flex-col", "max-sm:px-0")}>
        <div
          className={cn(
            "mx-auto py-6 max-w-[1200px] w-full",
            !hasSidebar && "max-w-[856px]",
          )}
        >
          <Breadcrumbs breadcrumbs={breadcrumbs} hasSidebar={hasSidebar} />
          <ScrollToTopButton />
          <div className="flex gap-x-6 max-w-full relative">{children}</div>
        </div>
      </div>
    </BaseLayout>
  );
}

export const ReferendaContentWrapper = ({ hasSidebar, children }) => {
  const [sidebarHeight, setSidebarHeight] = useLayoutSidebarHeight();
  useEffect(() => {
    return () => {
      setSidebarHeight(0);
    };
  }, [setSidebarHeight]);

  const [navCollapsed] = useNavCollapsed();
  return (
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
  );
};
