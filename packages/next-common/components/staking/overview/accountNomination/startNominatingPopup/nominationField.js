import PlusIcon from "next-common/components/callTreeView/plus";
import DetailButton from "next-common/components/detailButton";
import IconButton from "next-common/components/iconButton";
import PopupLabel from "next-common/components/popup/label";
import { cn } from "next-common/utils";

export function NominationField({ nominations }) {
  const hasNominations = nominations && nominations.length > 0;
  return (
    <div>
      <PopupLabel text="Nominate" />
      <div
        className={cn(
          "flex pl-[16px] pr-[8px] py-[12px] rounded-[8px]",
          "items-center justify-between",
          "border border-neutral200 bg-neutral200",
        )}
      >
        {hasNominations ? (
          <div className="text-textPrimary text14Medium">
            {nominations?.length || 0} Validators
          </div>
        ) : (
          <div className="text-textTertiary text14Medium">
            No Validators Selected
          </div>
        )}
        <div>
          <DetailButton className="!bg-neutral100" />
        </div>
      </div>
      <div className="flex mt-2 justify-end">
        <IconButton onClick={() => {}}>
          <PlusIcon size={12} />
          Add Validators
        </IconButton>
      </div>
    </div>
  );
}
