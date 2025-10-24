import { useRouter } from "next/router";
import { getRouterQuery } from "next-common/utils/router";
import ChainSocialLinks from "next-common/components/chain/socialLinks";
import generateLayoutRawTitle from "next-common/utils/generateLayoutRawTitle";
import BaseLayout from "next-common/components/layout/baseLayout";
import { cn } from "next-common/utils";
import TabsList from "next-common/components/tabs/list";
import AuthorityTable from "./authorityTable";
import UsernameTable from "./usernameTable";

const tabs = [
  {
    value: "usernames",
    label: "Usernames",
  },
  {
    value: "authority",
    label: "Authority",
  },
];

export default function UsernamesPage() {
  const router = useRouter();
  const activeTabValue = getRouterQuery(router, "tab") || tabs[0].value;

  return (
    <BaseLayout
      seoInfo={{ rawTitle: generateLayoutRawTitle("People Usernames") }}
    >
      <div className="bg-neutral100 border-b border-neutral300">
        <div className={cn("px-12 py-6 mx-auto max-w-[1200px]", "max-sm:px-6")}>
          <div className="flex justify-between w-full max-sm:flex-col-reverse max-sm:gap-y-3">
            <h3 className="text20Bold text-textPrimary">Usernames</h3>
          </div>
          <ChainSocialLinks className="mt-2" />
        </div>

        {tabs?.length > 0 && (
          <div className={cn("px-12 mx-auto max-w-[1200px]", "max-sm:px-6")}>
            <TabsList
              activeTabValue={activeTabValue}
              onTabClick={({ value }) => {
                const query = router.query;
                delete query["search"];
                delete query["authority"];
                if (value === tabs[0].value) {
                  delete query["tab"];
                } else {
                  query["tab"] = value;
                }
                router.replace(
                  {
                    pathname: router.pathname,
                    query,
                  },
                  undefined,
                  {
                    shallow: true,
                  },
                );
              }}
              tabs={tabs}
            />
          </div>
        )}
      </div>

      <div className="flex-1">
        <div className={cn("px-6 py-6 mx-auto max-w-[1200px]", "max-sm:px-0")}>
          <div className="space-y-6">
            {activeTabValue === "usernames" ? (
              <UsernameTable />
            ) : (
              <AuthorityTable />
            )}
          </div>
        </div>
      </div>
    </BaseLayout>
  );
}
