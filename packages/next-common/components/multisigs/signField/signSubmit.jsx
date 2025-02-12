import { SystemSignature } from "@osn/icons/subsquare";
import { Wrapper } from "./signApprove";
import { useState } from "react";
import Tooltip from "next-common/components/tooltip";
import dynamicPopup from "next-common/lib/dynamic/popup";

const SignSubmitPopup = dynamicPopup(() => import("./signSubmitPopup"));

export default function SignSubmit({ multisig = {} }) {
  const [isShowSignSubmitPopup, setIsShowSignSubmitPopup] = useState(false);

  return (
    <>
      <Tooltip content="Approve">
        <Wrapper onClick={() => setIsShowSignSubmitPopup(true)}>
          <SystemSignature role="button" className="w-4 h-4" />
        </Wrapper>
      </Tooltip>
      {isShowSignSubmitPopup && (
        <SignSubmitPopup
          onClose={() => setIsShowSignSubmitPopup(false)}
          multisig={multisig}
        />
      )}
    </>
  );
}
