import { MenuDelegation } from "@osn/icons/subsquare";
import { noop } from "lodash-es";
import Input from "next-common/components/input";

export default function DelegationSearchInput({
  address = "",
  setAddress = noop,
  delegateButton,
}) {
  return (
    <div className="flex items-center gap-x-2">
      <Input
        className="w-full h-10 bg-neutral100"
        placeholder="Please fill an address to delegate votes"
        prefix={<MenuDelegation className="text-textTertiary" />}
        value={address}
        onChange={(e) => {
          setAddress(e.target.value);
        }}
      />

      {delegateButton}
    </div>
  );
}
