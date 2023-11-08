import Link from "next/link";
import { useRouter } from "next/router";
import { isExternalLink } from "next-common/utils";

function UrlTabs({ tabs = [] }) {
  const router = useRouter();
  const routePath = router.asPath.split("?")[0];

  return (
    <ul className="flex space-x-6">
      {tabs.map((tab, idx) => {
        const isExternal = isExternalLink(tab.url);

        const active =
          tab.exactMatch === false
            ? routePath.startsWith(tab.url)
            : routePath === tab.url;

        return (
          <li key={idx}>
            <Link
              href={tab.url}
              target={isExternal ? "_blank" : "_self"}
              className="cursor-pointer"
            >
              {tab.render ? tab.render({ active }) : tab.label}
              {isExternal && (
                <span className="ml-1 text-textTertiary text14Medium">↗</span>
              )}
            </Link>
          </li>
        );
      })}
    </ul>
  );
}

export default UrlTabs;
