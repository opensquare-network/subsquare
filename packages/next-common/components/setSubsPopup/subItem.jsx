import AddressComboField from "next-common/components/popup/fields/addressComboField";
import SecondaryButton from "next-common/lib/button/secondary";
import { SystemSubtract } from "@osn/icons/subsquare";
import TextInputField from "next-common/components/popup/fields/textInputField";

export function SubItem({ subId, sub, updateSubField, onRemove }) {
  return (
    <div className="flex gap-x-4">
      <AddressComboField
        comboClassName="w-[290px] !rounded-lg"
        size="small"
        extensionAccounts={[]}
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
      <SecondaryButton
        className="w-10 h-10 mt-5"
        onClick={() => {
          onRemove(subId);
        }}
      >
        <SystemSubtract className="w-4 h-4" />
      </SecondaryButton>
    </div>
  );
}
