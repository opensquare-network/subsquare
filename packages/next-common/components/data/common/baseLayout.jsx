import { useDataTabsContext } from "../context/tabs";
import BaseLayout from "next-common/components/layout/baseLayout";
import { cn } from "next-common/utils";
import { STATICS_CDN_URL } from "next-common/utils/consts/statics";

export default function DataBaseLayout({ children }) {
  const { title = "" } = useDataTabsContext();
  const seoInfo = { title, desc: title };

  const lightBg = `${STATICS_CDN_URL}/public/project-page-bg-data-light.svg`;
  const darkBg = `${STATICS_CDN_URL}/public/project-page-bg-data-dark.svg`;

  return (
    <BaseLayout seoInfo={seoInfo}>
      <div
        className={cn(
          "flex-1",
          "[background:var(--event-light-background)]",
          "dark:[background:var(--event-dark-background)]",
        )}
        style={{
          "--event-light-background": `url(${lightBg}) repeat, linear-gradient(180deg, #FDFDFD 0%, #F6F7FA 100%)`,
          "--event-dark-background": `url(${darkBg}) repeat, linear-gradient(180deg, #212433 0%, #1E2130 100%)`,
        }}
      >
        <div className={"px-6 py-6 mx-auto max-w-[1200px] max-sm:px-0"}>
          {children}
        </div>
      </div>
    </BaseLayout>
  );
}
