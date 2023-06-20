import clsx from "clsx";
import BaseLayout from "./baseLayoutV2";

/**
 * @param {object} props
 * @param {JSX.Element} props.head - the head of the list
 * @param {JSX.Element} props.children - the list
 * @param {object} props.seoInfo - the seo info
 */
export default function ListLayout({ seoInfo = {}, children, head }) {
  return (
    <BaseLayout seoInfo={seoInfo}>
      {head && (
        <div className="bg-neutral100">
          <div className={clsx("px-6 mx-auto max-w-7xl", "max-sm:px-0")}>
            {head}
          </div>
        </div>
      )}
      <div className={clsx("px-6 my-6 mx-auto max-w-7xl", "max-sm:px-0")}>
        {children}
      </div>
    </BaseLayout>
  );
}
