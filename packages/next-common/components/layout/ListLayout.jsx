import clsx from "clsx";
import BaseLayout from "./baseLayoutV2";
import Link from "next/link";
import { useRouter } from "next/router";

/**
 * @param {object} props
 * @param {JSX.Element} props.summary - the summary area
 * @param {JSX.Element} props.children - the list
 * @param {object} props.seoInfo - the seo info
 * @param {{label: string, url: string}[]} props.tabs - the tabs
 * @param {string} props.title - the title
 * @param {string | JSX.Element} props.titleExtra - the title extra content
 * @param {string} props.description - the description
 * @param {JSX.Element} props.headContent - the head content
 */
export default function ListLayout({
  seoInfo = {},
  children,
  title,
  titleExtra,
  description,
  headContent,
  summary,
  tabs = [],
}) {
  const router = useRouter();

  return (
    <BaseLayout seoInfo={seoInfo}>
      <div className="bg-neutral100">
        <div className={clsx("px-12 py-6 mx-auto max-w-7xl", "max-sm:px-0")}>
          <div>
            <div className="flex justify-between items-baseline">
              <h3 className="text20Bold text-textPrimary">{title}</h3>
              {titleExtra}
            </div>

            <p className="text14Medium text-textTertiary">{description}</p>

            {headContent && <div className="mt-2">{headContent}</div>}

            {summary && (
              <>
                <hr className="h-px my-4 bg-neutral300" />
                {summary}
              </>
            )}
          </div>
        </div>
        {tabs?.length > 0 && (
          <ul className="flex space-x-8 px-12">
            {tabs.map((tab) => (
              <li key={tab.url}>
                <Link
                  href={tab.url}
                  className={clsx(
                    "block pb-3",
                    "text14Bold border-b-4 text-textPrimary",
                    "hover:text-theme500",
                    router.asPath.startsWith(tab.url)
                      ? "border-theme500 text-theme500"
                      : "border-transparent",
                  )}
                >
                  {tab.label}
                </Link>
              </li>
            ))}
          </ul>
        )}
      </div>

      <div className={clsx("px-6 my-6 mx-auto max-w-7xl", "max-sm:px-0")}>
        {children}
      </div>
    </BaseLayout>
  );
}
