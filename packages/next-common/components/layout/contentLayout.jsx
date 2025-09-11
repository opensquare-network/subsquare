import { cn } from "next-common/utils";
import BaseLayout from "./baseLayout";
import usePageTitle from "next-common/hooks/usePageTitle";

/**
 * @typedef {{
 * seoInfo?: Record<string, string>
 * children: JSX.Element
 * title: string
 * description: string
 * }} ContentLayoutProps
 */

/**
 * @param {ContentLayoutProps} props
 */
export default function ContentLayout({
  seoInfo: seoInfoProp = {},
  children,
  title,
  description,
}) {
  const seoTitle = usePageTitle(
    seoInfoProp.title ?? title ?? "governance platform",
  );

  const seoInfo = {
    title: "Subsquare | " + seoTitle,
    desc: description || seoInfoProp.desc,
  };

  return (
    <BaseLayout seoInfo={seoInfo}>
      <div className="flex-1">
        <div className={cn("px-6 py-6 mx-auto max-w-[1200px]", "max-sm:px-0")}>
          {children}
        </div>
      </div>
    </BaseLayout>
  );
}
