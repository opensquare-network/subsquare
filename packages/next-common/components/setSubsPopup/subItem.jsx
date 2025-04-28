import AddressComboField from "next-common/components/popup/fields/addressComboField";
import SecondaryButton from "next-common/lib/button/secondary";
import { SystemSubtract } from "@osn/icons/subsquare";
import Tooltip from "../tooltip";
import { Label } from "../popup/styled";
import Input from "next-common/lib/input";

export function SubItem({
  subId,
  sub,
  updateSubField,
  onRemove,
  extensionAccounts,
}) {
  return (
    <div className="flex gap-x-4">
      <AddressComboField
        comboClassName="w-[290px] !rounded-lg"
        size="small"
        extensionAccounts={extensionAccounts}
        defaultAddress={sub.address}
        setAddress={(value) => {
          if (value !== sub.address) {
            updateSubField("address", value);
          }
        }}
      />
      <div className="flex flex-1 flex-col">
        <Label>Sub Name</Label>
        <Input
          className="flex-1"
          value={sub.name}
          placeholder="Sub Name"
          onChange={(evt) => {
            const value = evt.target.value;
            if (value !== sub.name) {
              updateSubField("name", value);
            }
          }}
        />
      </div>
      <Tooltip content="Remove" className="mt-5">
        <SecondaryButton
          className="w-10 h-10 !px-0"
          onClick={() => {
            onRemove(subId);
          }}
        >
          <SystemSubtract className="w-6 h-6" />
        </SecondaryButton>
      </Tooltip>
    </div>
  );
}
