import { MenuDelegation } from "@osn/icons/subsquare";
import { noop } from "lodash-es";
import Input from "next-common/lib/input";

export default function DelegationSearchInput({
  address = "",
  setAddress = noop,
  delegateButton,
}) {
  return (
    <div className="flex items-center gap-x-2 [&>div]:w-full">
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
