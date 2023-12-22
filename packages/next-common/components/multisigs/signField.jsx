import { useState } from "react";
import Tooltip from "next-common/components/tooltip";
import {
  SystemClose,
  SystemSignature,
  SystemVoteAbstain,
  SystemVoteAye,
} from "@osn/icons/subsquare";
import useRealAddress from "next-common/utils/hooks/useRealAddress";
import SignerPopup from "../signerPopup";
import { MultisigStatus } from "./fields";
import GhostButton from "../buttons/ghostButton";
import noop from "lodash.noop";
import { cn } from "next-common/utils";
import { sendTx } from "next-common/utils/sendTx";
import { useDispatch } from "react-redux";
import { newErrorToast } from "next-common/store/reducers/toastSlice";
import isNil from "lodash.isnil";

export default function MultisigSignField({ multisig = {} }) {
  const realAddress = useRealAddress();
  const [signPopupVisible, setSignPopupVisible] = useState(false);
  const [cancelPopupVisible, setCancelPopupVisible] = useState(false);
  const [loading, setLoading] = useState(false);
  const dispatch = useDispatch();

  const { state, approvals } = multisig;
  const isApproved = approvals?.includes(realAddress);

  const name = state.name;

  const showErrorToast = (message) => dispatch(newErrorToast(message));

  async function action(api, signerAccount, apiModule) {
    if (!api) {
      return showErrorToast("Chain network is not connected yet");
    }

    const fn = api?.tx?.multisig?.[apiModule];

    if (isNil(fn)) {
      return showErrorToast("Multisig method is not support");
    }

    const signerAddress = signerAccount.address;
    const otherSigners = approvals.filter((a) => a !== signerAddress);

    const tx = fn(
      multisig.threshold,
      otherSigners,
      multisig.when,
      multisig.callHash,
      // FIXME: maxWeight
    );

    await sendTx({
      tx,
      setLoading,
      dispatch,
      signerAddress,
      onClose() {
        setSignPopupVisible(false);
        setCancelPopupVisible(false);
      },
    });
  }

  let content;
  if (name === MultisigStatus.Approving) {
    content = (
      <>
        {isApproved && (
          <Tooltip content="Cancel">
            <SignStatusButton
              onClick={() => {
                setCancelPopupVisible(true);
              }}
            >
              <SystemClose className="w-4 h-4 [&_path]:stroke-textPrimary [&_path]:fill-textPrimary" />
            </SignStatusButton>
          </Tooltip>
        )}
        <Tooltip content="Sign">
          <SignStatusButton
            onClick={() => {
              setSignPopupVisible(true);
            }}
          >
            <SystemSignature className="w-4 h-4 [&_path]:stroke-textPrimary [&_path]:stroke-2" />
          </SignStatusButton>
        </Tooltip>

        {cancelPopupVisible && (
          <SignerPopup
            title="Signature"
            confirmText="Cancel"
            loading={loading}
            onClose={() => {
              setCancelPopupVisible(false);
            }}
            actionCallback={(api, signerAccount) => {
              action(api, signerAccount, "cancelAsMulti");
            }}
          />
        )}
        {signPopupVisible && (
          <SignerPopup
            title="Signature"
            confirmText="Approve"
            loading={loading}
            onClose={() => {
              setSignPopupVisible(false);
            }}
            actionCallback={(api, signerAccount) => {
              action(api, signerAccount, "approveAsMulti");
            }}
          />
        )}
      </>
    );
  } else {
    content = isApproved ? (
      <Tooltip content="You didn't sign this multisig">
        <SystemVoteAbstain className="w-4 h-4" />
      </Tooltip>
    ) : (
      <Tooltip content="You approved this multisig">
        <SystemVoteAye className="w-4 h-4" />
      </Tooltip>
    );
  }

  return <div className="flex items-center justify-end gap-x-2">{content}</div>;
}

function SignStatusButton({ children, onClick = noop }) {
  return (
    <GhostButton
      className={cn("group", "!p-1.5 !w-7 !h-7 !rounded !border-neutral400")}
      onClick={onClick}
    >
      {children}
    </GhostButton>
  );
}
