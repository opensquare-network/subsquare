import clsx from "clsx";
import Breadcrumb from "next-common/components/_Breadcrumb";
import { useNavCollapsed } from "next-common/context/nav";
import useBreadcrumbs from "next-common/components/layout/DetailLayout/useBreadcrumbs";

export default function Breadcrumbs({ breadcrumbs }) {
  const [navCollapsed] = useNavCollapsed();
  const defaultBreadcrumbs = useBreadcrumbs();
  if (!breadcrumbs && !defaultBreadcrumbs) {
    return null;
  }

  const finalBreadcrumbs = breadcrumbs || defaultBreadcrumbs;
  return (
    <div
      className={clsx(
        "mb-6 px-12",
        navCollapsed ? "max-md:px-6" : "max-lg:px-6",
      )}
    >
      {finalBreadcrumbs?.length > 0 ? (
        <Breadcrumb items={finalBreadcrumbs} />
      ) : (
        breadcrumbs
      )}
    </div>
  );
}
