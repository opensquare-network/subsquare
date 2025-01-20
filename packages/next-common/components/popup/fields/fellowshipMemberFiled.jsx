import { useEffect, useState } from "react";
import FellowshipMemberSelector from "../../fellowshipMemberSelector";
import PopupLabel from "../label";

export default function FellowshipMemberFiled({
  title = "",
  defaultAddress,
  setAddress,
  setIsAvailableMember,
  type,
}) {
  const [targetAddress, setTargetAddress] = useState(defaultAddress);

  useEffect(() => {
    setAddress(targetAddress);
  }, [setAddress, targetAddress]);

  return (
    <div>
      <PopupLabel text={title} />
      <FellowshipMemberSelector
        address={targetAddress}
        setAddress={setTargetAddress}
        setIsAvailableMember={setIsAvailableMember}
        type={type}
      />
    </div>
  );
}
