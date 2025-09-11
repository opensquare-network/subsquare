import { useState } from "react";
import FellowshipMemberFiled from "next-common/components/popup/fields/fellowshipMemberFiled";

export default function useFellowshipMemberFiled({
  title = "Who",
  defaultAddress = "",
  loading,
  members,
} = {}) {
  const [beneficiary, setBeneficiary] = useState(defaultAddress);
  const [isAvailableMember, setIsAvailableMember] = useState(true);

  return {
    value: beneficiary,
    isAvailableMember,
    component: (
      <FellowshipMemberFiled
        title={title}
        members={members}
        loading={loading}
        setAddress={setBeneficiary}
        setIsAvailableMember={setIsAvailableMember}
        defaultAddress={defaultAddress}
        placeholder="Please fill the address or select another one..."
      />
    ),
  };
}
