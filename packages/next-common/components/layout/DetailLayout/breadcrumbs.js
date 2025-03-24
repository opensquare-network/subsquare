import { cn } from "next-common/utils";
import Breadcrumb from "next-common/components/_Breadcrumb";
import { useNavCollapsed } from "next-common/context/nav";
import useBreadcrumbs from "next-common/components/layout/DetailLayout/useBreadcrumbs";

export function Breadcrumbs({ breadcrumbs, hasSidebar }) {
  const [navCollapsed] = useNavCollapsed();

  return (
    <div
      className={cn(
        "mb-6 px-12",
        "w-full",
        hasSidebar ? "max-w-[calc(100%-320px-24px)]" : "max-w-full",
        navCollapsed ? "max-md:max-w-full" : "max-lg:max-w-full",
      )}
    >
      {breadcrumbs?.length > 0 ? (
        <Breadcrumb items={breadcrumbs} />
      ) : (
        breadcrumbs
      )}
    </div>
  );
}

export default function BreadcrumbsWithDefault({ breadcrumbs, hasSidebar }) {
  const defaultBreadcrumbs = useBreadcrumbs();
  if (!breadcrumbs && !defaultBreadcrumbs) {
    return null;
  }

  const finalBreadcrumbs = breadcrumbs || defaultBreadcrumbs;
  return <Breadcrumbs breadcrumbs={finalBreadcrumbs} hasSidebar={hasSidebar} />;
}
