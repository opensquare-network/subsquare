import DataList from "next-common/components/dataList";
import { useEnsureLogin } from "next-common/hooks/useEnsureLogin";
import nextApi from "next-common/services/nextApi";
import { useCallback, useMemo, useState } from "react";
import { useAsync } from "react-use";
import PrimaryButton from "next-common/lib/button/primary";
import dynamicPopup from "next-common/lib/dynamic/popup";
import { ArrowDown } from "@osn/icons/subsquare";
import { ActionIconButton, MultisigAccount, SignatorieAccount } from "./styled";
import WindowSizeProvider from "next-common/context/windowSize";
import IndentPanel from "../callTreeView/indentPanel";
import { cn } from "next-common/utils";
import Tooltip from "../tooltip";
import CellActions from "./cellActions";

const CreateMultisigPopup = dynamicPopup(() => import("../createMultisig"));

const columns = [
  {
    name: "Multisig Address",
  },
];

export default function MultisigAccountsList() {
  const [popupOpen, setPopupOpen] = useState(false);
  const { ensureLogin } = useEnsureLogin();
  const { value: multisigAccounts = [], loading } = useAsync(async () => {
    await ensureLogin();
    const { result } = await nextApi.fetch("user/multisigs");
    return result;
  }, []);

  const rows = useMemo(() => {
    return multisigAccounts.map((multisig) => [
      <Row key={multisig.multisigAddress} multisig={multisig} />,
    ]);
  }, [multisigAccounts]);

  return (
    <WindowSizeProvider>
      <div className="flex flex-col gap-y-4">
        <DataList columns={columns} rows={rows} loading={loading} />
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
              {multisig.signatories.map((signatory) => (
                <SignatorieAccount key={signatory} address={signatory} />
              ))}
            </div>
          </IndentPanel>
        )}
      </div>
      <div className="flex items-center gap-x-2 justify-end">
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
