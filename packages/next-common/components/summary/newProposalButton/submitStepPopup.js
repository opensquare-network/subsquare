import Popup from "next-common/components/popup/wrapper/Popup";
import Divider from "next-common/components/styled/layout/divider";
import { SystemYes } from "@osn/icons/subsquare";
import Flex from "next-common/components/styled/flex";
import Loading from "next-common/components/loading";
import SigningTip from "../newProposalQuickStart/common/signingTip";
import { usePopupActions } from "next-common/context/createReferendumStatus";
import useCreateProposalSubmit from "next-common/hooks/useCreateProposalSubmit";
import SignerPopupWrapper from "next-common/components/popupWithSigner/signerPopupWrapper";
import { useCallback, useEffect, useRef } from "react";

export function SubmitStepPopupContent({ onClose }) {
  const { createParams } = usePopupActions();
  const list = useCreateProposalSubmit(createParams);
  const isStarted = useRef(false);

  const doSubmits = useCallback(async () => {
    if (list.length === 0 || !createParams || isStarted.current) {
      return;
    }

    for (const item of list) {
      if (item.doSubmit && !item.isLoading) {
        isStarted.current = true;
        const res = await item.doSubmit();
        isStarted.current = false;
        if (!res) {
          onClose();
          break;
        }
      }
    }
  }, [createParams, list, onClose]);

  useEffect(() => {
    doSubmits();
  }, [list, doSubmits]);

  return (
    <Popup title="New Referendum" onClose={onClose}>
      {list.map((item) => (
        <div key={item.id} className="flex flex-col gap-y-2.5 text-textPrimary">
          <Flex className="items-center gap-2">
            <p className="text14Medium flex-1">{item.label}</p>
            {item.isLoading && <Loading size={20} />}
            {!item.isLoading && (
              <SystemYes className="[&>path]:stroke-theme500" />
            )}
          </Flex>
          <Divider />
        </div>
      ))}
      <SigningTip />
    </Popup>
  );
}

export default function SubmitStepPopup({ onClose }) {
  return (
    <SignerPopupWrapper onClose={onClose}>
      <SubmitStepPopupContent onClose={onClose} />
    </SignerPopupWrapper>
  );
}

// <div className="flex flex-col gap-y-2.5 text-textPrimary">
//   <Flex className="items-center gap-2">
//     <p className="text14Medium flex-1">Signing to create a preimage</p>
//     <SystemYes className="[&>path]:stroke-theme500" />
//     {/* <Loading size={20} /> */}
//     </Flex>
//     <Divider />
//   </div>
//   <div className="flex flex-col gap-y-2.5 text-textPrimary">
//     <Flex className="items-center gap-2">
//       <p className="text14Medium flex-1">
//         Signing to submit a OpenGov referendum
//       </p>
//       {/* <SystemYes /> */}
//       <Loading size={20} />
//     </Flex>
//     <Divider />
//   </div>
