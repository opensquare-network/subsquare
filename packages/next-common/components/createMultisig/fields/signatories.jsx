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
import { GreyPanel } from "next-common/components/styled/containers/greyPanel";
import { colorStyle, PromptTypes } from "next-common/components/scrollPrompt";
import { uniq } from "lodash-es";

export default function SignatoriesField() {
  const { signatories, addSignatory } = useSignatories();
  const showAccountError = useMemo(
    () => uniq(signatories).length !== signatories.length,
    [signatories],
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
        <GreyPanel
          style={colorStyle[PromptTypes.ERROR]}
          className="text14Medium px-4 py-2.5"
        >
          The signatories must be unique.
        </GreyPanel>
      )}
      <div className="flex justify-end">
        <Button
          onClick={addSignatory}
          className="text-theme500 gap-x-1 h-auto p-0"
          type="button"
        >
          <SystemPlus />
          Add Signatory
        </Button>
      </div>
    </div>
  );
}

function SignatoriesItem({ address, index }) {
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
          <SystemTrash className="text-red500" size={16} />
        </span>
      }
    />
  );
}
