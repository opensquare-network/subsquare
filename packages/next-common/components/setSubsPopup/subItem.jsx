import AddressComboField from "next-common/components/popup/fields/addressComboField";
import SecondaryButton from "next-common/lib/button/secondary";
import { SystemSubtract } from "@osn/icons/subsquare";
import TextInputField from "next-common/components/popup/fields/textInputField";
import Tooltip from "../tooltip";

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
            updateSubField(subId, "address", value);
          }
        }}
      />
      <TextInputField
        className="flex-1"
        title="Sub Name"
        text={sub.name}
        setText={(value) => {
          if (value !== sub.name) {
            updateSubField(subId, "name", value);
          }
        }}
      />
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
