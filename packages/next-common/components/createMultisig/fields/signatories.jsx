import IndentPanel from "next-common/components/callTreeView/indentPanel";
import AddressCombo from "next-common/components/addressCombo";
import { Label } from "../../popup/styled";
import MaybeProxySigner from "next-common/components/signer";
import { useExtensionAccounts } from "next-common/components/popupWithSigner/context";
import { SystemPlus, SystemTrash } from "@osn/icons/subsquare";
import Button from "next-common/lib/button";
import { useSignatories } from "../context/signatories";

export default function SignatoriesField() {
  const extensionAccounts = useExtensionAccounts();
  const { signatories, setSignatory, addSignatory, removeSignatory } =
    useSignatories();

  return (
    <div className="flex flex-col gap-y-2">
      <Label>Signatories</Label>
      <IndentPanel className="flex flex-col gap-2">
        <MaybeProxySigner noSwitch={true} />
        {signatories.map((address, index) => (
          <AddressCombo
            key={`signatory-${index}`}
            address={address}
            accounts={extensionAccounts}
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
        ))}
      </IndentPanel>
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
