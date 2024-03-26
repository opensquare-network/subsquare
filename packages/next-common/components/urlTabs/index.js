import Link from "next/link";
import { useRouter } from "next/router";
import { isExternalLink } from "next-common/utils";
import TabsList from "../tabsList";
import { forwardRef } from "react";
import { isNil } from "lodash-es";

export default forwardRef(function UrlTabs({ tabs = [], ...props }, ref) {
  const router = useRouter();
  const routePath = router.asPath.split("?")[0];

  return (
    <TabsList
      ref={ref}
      {...props}
      tabs={tabs.map((tab, idx) => {
        const isExternal = isExternalLink(tab.url);

        let active = tab.active;
        if (isNil(active)) {
          if (tab.exactMatch === false) {
            active = routePath.startsWith(tab.root || tab.url);
          } else {
            const urls = [tab.url, tab.root, ...(tab.urls || [])].filter(
              Boolean,
            );
            active = urls.includes(routePath);
          }
        }

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
              </Link>
            );
          },
        };
      })}
    />
  );
});
