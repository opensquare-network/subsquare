import AddressComboField from "next-common/components/popup/fields/addressComboField";
import SecondaryButton from "next-common/lib/button/secondary";
import { SystemSubtract } from "@osn/icons/subsquare";
import Tooltip from "../tooltip";
import { Label } from "../popup/styled";
import Input from "next-common/lib/input";
import { useIsMobile } from "../overview/accountInfo/components/accountBalances";
import { cn } from "next-common/utils";
import Divider from "../styled/layout/divider";

export function SubItem({
  subId,
  sub,
  updateSubField,
  onRemove,
  extensionAccounts,
}) {
  const isMobile = useIsMobile();
  return (
    <div
      className={cn("flex gap-x-4 flex-row", isMobile && "gap-y-4 flex-col")}
    >
      <AddressComboField
        comboClassName={cn("w-[290px] !rounded-lg", isMobile && "w-full")}
        size="small"
        canEdit={false}
        extensionAccounts={extensionAccounts}
        defaultAddress={sub.address}
        setAddress={(value) => {
          if (value !== sub.address) {
            updateSubField("address", value);
          }
        }}
      />
      <div className="flex flex-1 flex-row gap-x-4">
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
      <Divider className={cn("my-2 hidden", isMobile && "block")} />
    </div>
  );
}
