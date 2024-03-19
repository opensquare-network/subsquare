import { MenuAnnouncement } from "@osn/icons/subsquare";
import { SecondaryCard } from "next-common/components/styled/containers/secondaryCard";
import Tooltip from "next-common/components/tooltip";
import PrimaryButton from "next-common/lib/button/primary";

export default function PublicAnnouncement() {
  return (
    <SecondaryCard className="flex flex-row gap-[16px]">
      <div className="p-[8px] rounded-[8px] bg-theme100">
        <MenuAnnouncement className="w-[24px] h-[24px] [&_path]:fill-theme500" />
      </div>
      <div className="flex flex-col grow">
        <span className="text16Bold text-textPrimary">
          Publish my announcement
        </span>
        <span className="text14Medium text-textTertiary">
          Make a statement to get more delegators.
        </span>
      </div>
      <div className="flex items-center">
        <Tooltip content="Coming soon">
          <PrimaryButton disabled>Publish</PrimaryButton>
        </Tooltip>
      </div>
    </SecondaryCard>
  );
}
