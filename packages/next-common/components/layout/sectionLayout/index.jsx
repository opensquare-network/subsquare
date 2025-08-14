import { cn } from "next-common/utils";
import BaseLayout from "../baseLayout";
import { useNavCollapsed } from "next-common/context/nav";
import Breadcrumbs from "next-common/components/layout/DetailLayout/breadcrumbs";
import ScrollToTopButton from "next-common/components/layout/DetailLayout/ScrollToTopButton";

export default function SectionLayout({ seoInfo, breadcrumbs, children }) {
  const [navCollapsed] = useNavCollapsed();

  return (
    <BaseLayout seoInfo={seoInfo}>
      <div className={cn("bg-pageBg px-6 flex-1 flex flex-col", "max-sm:px-0")}>
        <div className={cn("mx-auto py-6 max-w-[1200px] w-full")}>
          <Breadcrumbs breadcrumbs={breadcrumbs} />

          {/*Click the floating window button and slide to the top of the browser*/}
          <ScrollToTopButton />

          {/* set relative for right side(vote) component */}
          <div className="flex gap-x-6 max-w-full relative">
            <div
              className={cn(
                "w-full",
                navCollapsed ? "max-md:max-w-full" : "max-lg:max-w-full",
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
