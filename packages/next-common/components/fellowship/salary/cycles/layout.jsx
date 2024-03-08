import Breadcrumbs from "next-common/components/layout/DetailLayout/breadcrumbs";
import BaseLayout from "next-common/components/layout/baseLayout";
import { cn } from "next-common/utils";

export default function FellowshipSalaryCycleLayout({ children, ...props }) {
  const title = "Fellowship Salary Cycle";
  const desc =
    "The salary pallet controls the periodic process of salary payments and members registration.";
  const seoInfo = { title, desc };

  return (
    <BaseLayout title={title} description={desc} seoInfo={seoInfo} {...props}>
      <div className={cn("bg-pageBg px-6 flex-1 flex flex-col", "max-sm:px-0")}>
        <div className="mx-auto py-6 max-w-[1200px] w-full">
          <Breadcrumbs />

          {children}
        </div>
      </div>
    </BaseLayout>
  );
}
