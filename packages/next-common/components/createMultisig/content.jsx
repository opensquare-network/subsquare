import AddressCombo from "next-common/components/addressCombo";
import Select from "next-common/components/select";
import IndentPanel from "../callTreeView/indentPanel";
import { Label } from "../popup/styled";
import MaybeProxySigner from "../signer";
import { useExtensionAccounts } from "../popupWithSigner/context";
import { useCallback, useState } from "react";
import Button from "next-common/lib/button";
import PrimaryButton from "next-common/lib/button/primary";
import { SystemPlus, SystemTrash } from "@osn/icons/subsquare";
import TextInputField from "../popup/fields/textInputField";
import nextApi from "next-common/services/nextApi";
import { useEnsureLogin } from "next-common/hooks/useEnsureLogin";
import useRealAddress from "next-common/utils/hooks/useRealAddress";

export default function CreateMultisigContent() {
  const address = useRealAddress();
  const { ensureLogin } = useEnsureLogin();
  const extensionAccounts = useExtensionAccounts();
  const [signatories, setSignatories] = useState([]);
  const [threshold, setThreshold] = useState();
  const [name, setName] = useState("");

  const setSignatory = useCallback(
    (address, index) => {
      signatories[index] = address;
      setSignatories([...signatories]);
    },
    [signatories],
  );

  const addSignatory = useCallback(() => {
    setSignatories([...signatories, ""]);
  }, [signatories]);

  const removeSignatory = useCallback(
    (index) => {
      signatories.splice(index, 1);
      setSignatories([...signatories]);
    },
    [signatories],
  );

  const handleSubmit = useCallback(
    async (e) => {
      await ensureLogin();
      e.preventDefault();
      await nextApi.post("user/multisigs", {
        signatories: [address, ...signatories],
        threshold,
        name,
      });
    },
    [ensureLogin, address, signatories, threshold, name],
  );

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-y-4">
      <Label>Signatories</Label>
      <IndentPanel className="flex flex-col gap-2">
        <MaybeProxySigner noSwitch={true} />
        {signatories.map((address, index) => (
          <AddressCombo
            key={`${address}-${index}`}
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
        <Button onClick={addSignatory} className="text-theme500 gap-x-1">
          <SystemPlus />
          Add Signatory
        </Button>
      </div>
      <div className="flex flex-col gap-y-1">
        <Label>Threshold</Label>
        <Select
          disabled={signatories.length === 0}
          value={threshold}
          onChange={(item) => setThreshold(item.value)}
          options={Array.from({ length: signatories.length }, (_, i) => ({
            label: `${i + 1}`,
            value: i,
          }))}
        />
      </div>
      <TextInputField
        title="Name"
        text={name}
        setText={setName}
        placeholder="Please fill the name..."
      />
      <div className="flex justify-end">
        <PrimaryButton type="submit">Submit</PrimaryButton>
      </div>
    </form>
  );
}
