import { noop } from "lodash-es";
import { useMemo } from "react";
import Loading from "../loading";
import { cn, isSameAddress } from "next-common/utils";
import Tooltip from "../tooltip";
import MultisigDisplay from "../importMultisig/multisigDisplay";
import { normalizeAddress } from "next-common/utils/address";
import { ArrowRight } from "@osn/icons/subsquare";
import { usePopupOnClose } from "next-common/context/popup";
import { useMultisigAccounts } from "../multisigs/context/multisigAccountsContext";

export default function MultiSignerAccounts({ selected, onSelect = noop }) {
  const onClose = usePopupOnClose();

  const { multisigs, isLoading } = useMultisigAccounts();

  const multisigList = useMemo(
    () =>
      (multisigs || []).map((item) => ({
        ...item,
        multisigAddress: normalizeAddress(item.multisigAddress),
      })),
    [multisigs],
  );

  const list = useMemo(() => {
    if (isLoading) {
      return (
        <div className="flex justify-center">
          <Loading size={20} />
        </div>
      );
    } else if (!multisigList.length) {
      return (
        <div className="flex justify-center text14Medium text-textTertiary">
          No multisig accounts
        </div>
      );
    } else {
      return (
        <div className="flex flex-col gap-[12px]">
          {multisigList.map((multisig) => {
            const isSelected = isSameAddress(
              selected?.multisigAddress,
              multisig.multisigAddress,
            );
            return (
              <MultisigDisplay
                key={multisig.multisigAddress}
                multisig={multisig}
                showCopyableAddress={false}
                onClick={() => {
                  onSelect(multisig);
                  onClose?.();
                }}
                className={cn(
                  isSameAddress(
                    selected?.multisigAddress,
                    multisig.multisigAddress,
                  ) && "cursor-default bg-neutral200 border-transparent",
                )}
              >
                {isSelected ? null : (
                  <ArrowRight
                    className={cn(
                      "w-[20px] h-[20px]",
                      "[&_path]:stroke-textTertiary group-hover:[&_path]:stroke-textSecondary",
                    )}
                  />
                )}
              </MultisigDisplay>
            );
          })}
        </div>
      );
    }
  }, [isLoading, multisigList, onClose, onSelect, selected?.multisigAddress]);

  return (
    <div className="flex flex-col gap-[12px]">
      <div className="text14Bold text-textPrimary flex items-center gap-1">
        Multisig Accounts{" "}
        <Tooltip content="multisig accounts are used to sign transactions with multiple signatures."></Tooltip>
      </div>
      {list}
    </div>
  );
}
