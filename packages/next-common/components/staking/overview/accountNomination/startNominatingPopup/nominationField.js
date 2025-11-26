import PlusIcon from "next-common/components/callTreeView/plus";
import DetailButton from "next-common/components/detailButton";
import IconButton from "next-common/components/iconButton";
import PopupLabel from "next-common/components/popup/label";
import { cn } from "next-common/utils";
import { useState } from "react";
import dynamicPopup from "next-common/lib/dynamic/popup";

const ValidatorSelectPopup = dynamicPopup(() =>
  import(
    "next-common/components/staking/overview/accountNomination/validatorSelectPopup"
  ),
);

export function NominationField({ nominations, setNominations }) {
  const [showValidatorSelectPopup, setShowValidatorSelectPopup] =
    useState(false);
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
          <DetailButton
            className="!bg-neutral100"
            onClick={() => setShowValidatorSelectPopup(true)}
          />
        </div>
      </div>
      <div className="flex mt-2 justify-end">
        <IconButton onClick={() => setShowValidatorSelectPopup(true)}>
          <PlusIcon size={12} />
          Add Validators
        </IconButton>
      </div>
      {showValidatorSelectPopup && (
        <ValidatorSelectPopup
          onClose={() => setShowValidatorSelectPopup(false)}
          nominations={nominations}
          setNominations={setNominations}
        />
      )}
    </div>
  );
}
