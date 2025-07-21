import IndentPanel from "next-common/components/callTreeView/indentPanel";
import AddressCombo from "next-common/components/addressCombo";
import { Label } from "../../popup/styled";
import MaybeProxySigner from "next-common/components/signer";
import { useExtensionAccounts } from "next-common/components/popupWithSigner/context";
import { SystemPlus, SystemTrash } from "@osn/icons/subsquare";
import Button from "next-common/lib/button";
import { useSignatories } from "../context/signatories";
import { useMemo } from "react";
import useRealAddress from "next-common/utils/hooks/useRealAddress";
import { isEmpty, uniq } from "lodash-es";
import Tooltip from "next-common/components/tooltip";
import { useContextApi } from "next-common/context/api";
import { cn } from "next-common/utils";
import { ERROR_MESSAGE, MultisigErrorMessage } from "../styled";

export default function SignatoriesField() {
  const { signatories } = useSignatories();
  const filteredSignatories = useMemo(
    () => signatories.filter((signatory) => !isEmpty(signatory)),
    [signatories],
  );
  const showAccountError = useMemo(
    () => uniq(filteredSignatories).length !== filteredSignatories.length,
    [filteredSignatories],
  );

  return (
    <div className="flex flex-col gap-y-2">
      <Label>Signatories</Label>
      <IndentPanel className="flex flex-col gap-2">
        <MaybeProxySigner noSwitch={true} />
        {signatories.map((address, index) => (
          <SignatoriesItem
            key={`signatory-${index}`}
            address={address}
            index={index}
          />
        ))}
      </IndentPanel>
      {showAccountError && (
        <MultisigErrorMessage>
          {ERROR_MESSAGE.UNIQUE_ERROR}
        </MultisigErrorMessage>
      )}
      <div className="flex justify-end">
        <AddSignatoryButton />
      </div>
    </div>
  );
}

function AddSignatoryButton() {
  const api = useContextApi();
  const { signatories, addSignatory } = useSignatories();
  const maxSignatories = api?.consts?.multisig?.maxSignatories.toNumber();

  const isDisabled = useMemo(() => {
    return signatories.length >= maxSignatories;
  }, [signatories, maxSignatories]);

  return (
    <Tooltip content={`Max signatory: ${maxSignatories}`}>
      <Button
        onClick={addSignatory}
        className={cn(
          "text-theme500 gap-x-1 h-auto p-0",
          isDisabled && "text-textDisabled",
        )}
        type="button"
        disabled={isDisabled}
      >
        <SystemPlus />
        Add Signatory
      </Button>
    </Tooltip>
  );
}

function SignatoriesItem({ address = "", index }) {
  const realAddress = useRealAddress();
  const extensionAccounts = useExtensionAccounts();
  const { removeSignatory, signatories, setSignatory } = useSignatories();

  const allowedAccounts = useMemo(
    () => extensionAccounts.filter((item) => item.address !== realAddress),
    [extensionAccounts, realAddress],
  );

  const accountOptions = useMemo(
    () =>
      allowedAccounts.filter(
        (item) =>
          item.address === address || !signatories.includes(item.address),
      ),
    [allowedAccounts, address, signatories],
  );

  return (
    <AddressCombo
      key={`signatory-${index}`}
      address={address}
      accounts={accountOptions}
      setAddress={(add) => setSignatory(add, index)}
      rightContent={
        <span
          className="cursor-pointer"
          onClick={(e) => {
            e.stopPropagation();
            removeSignatory(index);
          }}
        >
          <SystemTrash className="text-red500 w-5 h-5" size={20} />
        </span>
      }
    />
  );
}
