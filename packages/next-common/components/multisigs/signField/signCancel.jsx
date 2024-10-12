import { SystemClose } from "@osn/icons/subsquare";
import { Wrapper } from "./signApprove";
import { useState } from "react";

export default function SignCancel() {
  const [isDisabled, setIsDisabled] = useState(false);

  const handleSignCancel = () => {
    setIsDisabled(true);
  };

  return (
    <Wrapper disabled={isDisabled} className="mr-3">
      <span>
        <SystemClose className="w-4 h-4" onClick={handleSignCancel} />
      </span>
    </Wrapper>
  );
}
