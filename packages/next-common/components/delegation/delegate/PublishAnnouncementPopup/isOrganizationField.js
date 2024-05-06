import PopupLabel from "next-common/components/popup/label";
import Checkbox from "next-common/components/checkbox";
import { cn } from "next-common/utils";

export default function IsOrganizationField({
  isOrganization,
  setIsOrganization,
}) {
  return (
    <div>
      <PopupLabel text="isOrganization" />
      <div
        className={cn(
          "flex justify-between items-center",
          "py-[10px] pl-[16px]",
          "text-textPrimary bg-neutral100",
          "rounded-[8px] border border-neutral400 ",
        )}
      >
        <span className="text-text14Medium">
          {"I'm a member of an organization"}
        </span>
        <Checkbox
          className={"mr-[10px]"}
          checked={isOrganization}
          onClick={() => setIsOrganization(!isOrganization)}
        />
      </div>
    </div>
  );
}
