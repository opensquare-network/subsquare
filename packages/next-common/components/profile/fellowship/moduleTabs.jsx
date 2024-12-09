import TabsList from "next-common/components/tabs/list";
import { useCollectivesContext } from "next-common/context/collectives/collectives";
import { usePageProps } from "next-common/context/page";
import { cn } from "next-common/utils";
import { tryConvertToEvmAddress } from "next-common/utils/mixedChainUtil";
import Link from "next/link";
import { usePathname } from "next/navigation";
import tw from "tailwind-styled-components";

const Label = tw.button`
  text16Bold
  text-textTertiary
`;

export default function ProfileFellowshipModuleTabs() {
  const { id } = usePageProps();
  const pathname = usePathname();
  const { section } = useCollectivesContext();

  const maybeEvmAddress = tryConvertToEvmAddress(id);

  const urls = {
    core: `/user/${maybeEvmAddress}/${section}`,
    salary: `/user/${maybeEvmAddress}/${section}/salary`,
  };

  const tabs = [
    {
      value: "core",
      label: (
        <Label className={cn(pathname === urls.core && "text-textPrimary")}>
          <Link shallow href={urls.core}>
            Core
          </Link>
        </Label>
      ),
    },
    {
      value: "salary",
      label: (
        <Label className={cn(pathname === urls.salary && "text-textPrimary")}>
          <Link shallow href={urls.salary}>
            Salary
          </Link>
        </Label>
      ),
    },
  ];

  return (
    <div className="space-y-4">
      <TabsList tabs={tabs} className="px-6 " />
    </div>
  );
}
