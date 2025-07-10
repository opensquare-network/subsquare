import DataList from "next-common/components/dataList";
import { useCallback, useMemo, useState } from "react";
import PrimaryButton from "next-common/lib/button/primary";
import dynamicPopup from "next-common/lib/dynamic/popup";
import { ArrowDown } from "@osn/icons/subsquare";
import { ActionIconButton, MultisigAccount, SignatorieAccount } from "./styled";
import WindowSizeProvider from "next-common/context/windowSize";
import IndentPanel from "../callTreeView/indentPanel";
import { cn } from "next-common/utils";
import Tooltip from "../tooltip";
import CellActions from "./cellActions";
import { useMultisigAccounts } from "./context/accountsContext";

const CreateMultisigPopup = dynamicPopup(() => import("../createMultisig"));

const columns = [
  {
    name: "Multisig Address",
  },
];

export default function MultisigAccountsList() {
  const [popupOpen, setPopupOpen] = useState(false);
  const { multisigs = [], isLoading } = useMultisigAccounts();

  const rows = useMemo(() => {
    return multisigs.map((multisig) => [
      <Row key={multisig.multisigAddress} multisig={multisig} />,
    ]);
  }, [multisigs]);

  return (
    <WindowSizeProvider>
      <div className="flex flex-col gap-y-4">
        <DataList columns={columns} rows={rows} loading={isLoading} />
        <div className="flex justify-end">
          <PrimaryButton onClick={() => setPopupOpen(true)}>
            Add Multisig Account
          </PrimaryButton>
        </div>
        {popupOpen && (
          <CreateMultisigPopup onClose={() => setPopupOpen(false)} />
        )}
      </div>
    </WindowSizeProvider>
  );
}

function Row({ multisig }) {
  const [isExtended, setIsExtended] = useState(false);

  const handleExtend = useCallback(() => {
    setIsExtended(!isExtended);
  }, [isExtended]);

  return (
    <div className="w-full flex items-start justify-between">
      <div>
        <MultisigAccount multisig={multisig} />
        {isExtended && (
          <IndentPanel className="ml-4 mt-4">
            <div className="flex flex-col gap-y-4">
              {multisig.signatories.map((signatory, index) => (
                <SignatorieAccount
                  key={`signatory-${index}-${signatory}`}
                  address={signatory}
                />
              ))}
            </div>
          </IndentPanel>
        )}
      </div>
      <div className="flex items-center gap-x-2 justify-end h-10">
        <CellActions multisig={multisig} />

        <Tooltip content="Signatories">
          <ActionIconButton
            onClick={handleExtend}
            className="[&_svg_path]:!stroke-textPrimary"
          >
            <ArrowDown
              className={cn("w-4 h-4", {
                "rotate-180": isExtended,
              })}
            />
          </ActionIconButton>
        </Tooltip>
      </div>
    </div>
  );
}
