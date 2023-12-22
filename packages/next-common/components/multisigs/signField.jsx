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

export default function MultisigSignField({ multisig = {} }) {
  const realAddress = useRealAddress();
  const [signPopupVisible, setSignPopupVisible] = useState(false);
  const [cancelPopupVisible, setCancelPopupVisible] = useState(false);

  const { state, approvals } = multisig;
  const isApproved = approvals?.includes(realAddress);

  const name = state.name;

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
            onClose={() => {
              setCancelPopupVisible(false);
            }}
          />
        )}
        {signPopupVisible && (
          <SignerPopup
            title="Signature"
            confirmText="Approve"
            onClose={() => {
              setSignPopupVisible(false);
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
