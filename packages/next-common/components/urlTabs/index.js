import Link from "next/link";
import { useRouter } from "next/router";
import { isExternalLink } from "next-common/utils";
import TabsList from "../tabsList";

function UrlTabs({ tabs = [], ...props }) {
  const router = useRouter();
  const routePath = router.asPath.split("?")[0];

  return (
    <TabsList
      {...props}
      tabs={tabs.map((tab, idx) => {
        const isExternal = isExternalLink(tab.url);

        const active =
          tab.exactMatch === false
            ? routePath.startsWith(tab.url)
            : routePath === tab.url;

        return {
          ...tab,
          render() {
            return (
              <Link
                key={idx}
                href={tab.url}
                target={isExternal ? "_blank" : "_self"}
              >
                {tab.render ? tab.render({ active }) : tab.label}
                {!!tab.activeCount && (
                  <span className="ml-1 text-textTertiary text16Medium">
                    {tab.activeCount}
                  </span>
                )}
              </Link>
            );
          },
        };
      })}
    />
  );
}

export default UrlTabs;
