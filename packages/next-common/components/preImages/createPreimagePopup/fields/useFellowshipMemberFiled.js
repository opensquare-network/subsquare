import { useState } from "react";
import FellowshipMemberFiled from "next-common/components/popup/fields/fellowshipMemberFiled";

export default function useFellowshipMemberFiled({
  title = "Who",
  defaultAddress = "",
} = {}) {
  const [beneficiary, setBeneficiary] = useState(defaultAddress);

  return {
    value: beneficiary,
    component: (
      <FellowshipMemberFiled
        title={title}
        setAddress={setBeneficiary}
        defaultAddress={defaultAddress}
        placeholder="Please fill the address or select another one..."
      />
    ),
  };
}
