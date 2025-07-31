import TabsList from "next-common/components/tabs/list";
import { useCollectivesContext } from "next-common/context/collectives/collectives";
import { usePageProps } from "next-common/context/page";
import { cn } from "next-common/utils";
import { tryConvertToEvmAddress } from "next-common/utils/mixedChainUtil";
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
    votes: `/user/${maybeEvmAddress}/${section}`,
    core: `/user/${maybeEvmAddress}/${section}/core`,
    salary: `/user/${maybeEvmAddress}/${section}/salary`,
  };

  const tabs = [
    {
      value: "votes",
      label: (
        <Label className={cn(pathname === urls.votes && "text-textPrimary")}>
          Votes
        </Label>
      ),
      url: urls.votes,
      shallow: true,
    },
    {
      value: "core",
      label: (
        <Label className={cn(pathname === urls.core && "text-textPrimary")}>
          Core
        </Label>
      ),
      url: urls.core,
      shallow: true,
    },
    {
      value: "salary",
      label: (
        <Label className={cn(pathname === urls.salary && "text-textPrimary")}>
          Salary
        </Label>
      ),
      url: urls.salary,
      shallow: true,
    },
  ];

  return (
    <div className="space-y-4">
      <TabsList tabs={tabs} className="px-6 " />
    </div>
  );
}
