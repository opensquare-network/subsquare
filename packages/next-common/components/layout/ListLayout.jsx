import clsx from "clsx";
import BaseLayout from "./baseLayoutV2";
import Link from "next/link";
import { useRouter } from "next/router";

/**
 * @param {object} props
 * @param {JSX.Element} props.head - the head of the list
 * @param {JSX.Element} props.children - the list
 * @param {object} props.seoInfo - the seo info
 * @param {{label: string, url: string}[]} props.tabs - the seo info
 */
export default function ListLayout({
  seoInfo = {},
  children,
  head,
  tabs = [],
}) {
  const router = useRouter();
  console.log(router.asPath);

  return (
    <BaseLayout seoInfo={seoInfo}>
      {head && (
        <div className="bg-neutral100">
          <div className={clsx("px-6 mx-auto max-w-7xl", "max-sm:px-0")}>
            {head}

            {tabs?.length > 0 && (
              <ul className="flex px-6 space-x-8">
                {tabs.map((tab) => (
                  <li
                    key={tab.url}
                    className={clsx(
                      "text14Bold pb-3 border-b-4 text-textPrimary",
                      "hover:text-theme500",
                      router.asPath.startsWith(tab.url)
                        ? "border-theme500 text-theme500"
                        : "border-transparent",
                    )}
                  >
                    <Link href={tab.url} className="">
                      {tab.label}
                    </Link>
                  </li>
                ))}
              </ul>
            )}
          </div>
        </div>
      )}
      <div className={clsx("px-6 my-6 mx-auto max-w-7xl", "max-sm:px-0")}>
        {children}
      </div>
    </BaseLayout>
  );
}
