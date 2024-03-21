import React from "react";
import AddressComboField from "next-common/components/popup/fields/addressComboField";
import { GreyPanel } from "next-common/components/styled/containers/greyPanel";
import Account from "next-common/components/account";
import PopupLabel from "next-common/components/popup/label";

export default function Target(props) {
  const label = "Target";

  if (props.disabled) {
    return (
      <div>
        <PopupLabel text={label} />
        <GreyPanel className="py-3 px-4 gap-4">
          <Account account={{ address: props.defaultAddress }} />
        </GreyPanel>
      </div>
    );
  }

  return <AddressComboField {...props} title={label} />;
}
