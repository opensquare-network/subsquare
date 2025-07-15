import DataList from "next-common/components/dataList";
import { memo, useCallback, useMemo, useState } from "react";
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
import { GreyPanel } from "../styled/containers/greyPanel";
import { useChainSettings } from "next-common/context/chain";
import { sortAddresses } from "@polkadot/util-crypto";

const CreateMultisigPopup = dynamicPopup(() => import("../createMultisig"));

const columns = [
  {
    name: "Multisig Address",
  },
];

const MultisigAccountList = memo(function MultisigAccountList({
  multisigs,
  isLoading,
}) {
  const rows = useMemo(() => {
    return multisigs.map((multisig) => [
      <Row key={multisig.multisigAddress} multisig={multisig} />,
    ]);
  }, [multisigs]);

  const isEmpty = multisigs.length === 0 && !isLoading;

  if (isEmpty) {
    return <ListEmpty />;
  }

  return (
    <DataList noDataText="" columns={columns} rows={rows} loading={isLoading} />
  );
});

export default function MultisigAccountsList() {
  const [popupOpen, setPopupOpen] = useState(false);
  const { multisigs = [], isLoading } = useMultisigAccounts();

  return (
    <WindowSizeProvider>
      <div className="flex flex-col gap-y-4">
        <MultisigAccountList multisigs={multisigs} isLoading={isLoading} />
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

function ListEmpty() {
  return (
    <GreyPanel className="px-4 py-2.5 text14Medium text-textSecondary">
      You have no multisig accounts.
    </GreyPanel>
  );
}

function Row({ multisig }) {
  const { ss58Format } = useChainSettings();
  const sortedSignatories = sortAddresses(
    multisig.signatories || [],
    ss58Format,
  );
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
              {sortedSignatories.map((signatory, index) => (
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
