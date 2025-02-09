import { SystemSignature } from "@osn/icons/subsquare";
import { Wrapper } from "./signApprove";
import { useState } from "react";
import Tooltip from "next-common/components/tooltip";
import dynamicPopup from "next-common/lib/dynamic/popup";

const SignSubmitPopup = dynamicPopup(() => import("./signSubmitPopup"));

export default function SignSubmit({ multisig = {} }) {
  const [isShowSignSubmitPopup, setIsShowSignSubmitPopup] = useState(false);

  return (
    <Wrapper>
      <Tooltip content="Approve">
        <SystemSignature
          role="button"
          className="w-4 h-4"
          onClick={() => setIsShowSignSubmitPopup(true)}
        />
      </Tooltip>
      {isShowSignSubmitPopup && (
        <SignSubmitPopup
          onClose={() => setIsShowSignSubmitPopup(false)}
          multisig={multisig}
        />
      )}
    </Wrapper>
  );
}
