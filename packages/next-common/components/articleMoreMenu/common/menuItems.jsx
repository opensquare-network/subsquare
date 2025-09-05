import { useEffect, useState } from "react";
import { OptionItem } from "next-common/components/internalDropdown/styled";
import {
  SystemCancel,
  SystemCopied,
  SystemCopy,
  SystemEdit,
  SystemFlag,
  SystemLink,
  SystemTrash,
} from "@osn/icons/subsquare";
import { InfoPlus } from "@osn/icons/subsquare";
import { noop } from "lodash-es";
import { useReferendaIsVoting } from "next-common/context/post/referenda/useReferendumVotingFinishHeight";

export function LinkMenuItem({ onClick }) {
  return (
    <OptionItem onClick={onClick}>
      <div className="mr-2">
        <SystemLink />
      </div>
      <span>Link</span>
    </OptionItem>
  );
}

export function UnlinkMenuItem({ setShowUnlinkPopup, setShow }) {
  return (
    <OptionItem
      onClick={() => {
        setShowUnlinkPopup(true);
        setShow(false);
      }}
    >
      <div className="mr-2">
        <SystemLink />
      </div>
      <span>Unlink</span>
    </OptionItem>
  );
}

export function EditMenuItem({ setIsEdit, setShow }) {
  return (
    <OptionItem
      onClick={() => {
        setIsEdit(true);
        setShow(false);
      }}
    >
      <div className="mr-2">
        <SystemEdit />
      </div>
      <span>Edit</span>
    </OptionItem>
  );
}

export function CopyMenuItem({ onCopy = noop }) {
  const [copyState, setCopyState] = useState(false);

  useEffect(() => {
    if (copyState) {
      setTimeout(() => {
        setCopyState(false);
      }, 3000);
    }
  }, [copyState]);

  return (
    <OptionItem
      onClick={() => {
        try {
          onCopy();
        } catch (e) {
          // fixme: we should not ignore
        } finally {
          setCopyState(true);
        }
      }}
    >
      <div className="mr-2">
        {copyState ? <SystemCopied /> : <SystemCopy />}
      </div>
      <span>{copyState ? "Copied" : "Copy Link"}</span>
    </OptionItem>
  );
}

export function ReportMenuItem({ setShowReportPopup, setShow }) {
  return (
    <OptionItem
      onClick={() => {
        setShow(false);
        setShowReportPopup(true);
      }}
    >
      <div className="mr-2">
        <SystemFlag />
      </div>
      <span>Report</span>
    </OptionItem>
  );
}

export function DeleteMenuItem({ setShowDeletePopup, setShow }) {
  return (
    <OptionItem
      onClick={() => {
        setShowDeletePopup(true);
        setShow(false);
      }}
    >
      <div className="mr-2">
        <SystemTrash />
      </div>
      <span>Delete</span>
    </OptionItem>
  );
}

export function CancelReferendumMenuItem({
  setShowCancelReferendumPopup,
  setShow,
}) {
  const isVoting = useReferendaIsVoting();
  if (!isVoting) {
    return null;
  }

  return (
    <OptionItem
      onClick={() => {
        setShowCancelReferendumPopup(true);
        setShow(false);
      }}
    >
      <div className="mr-2">
        <SystemCancel />
      </div>
      <span>Cancel</span>
    </OptionItem>
  );
}

export function KillReferendumMenuItem({
  setShowKillReferendumPopup,
  setShow,
}) {
  const isVoting = useReferendaIsVoting();
  if (!isVoting) {
    return null;
  }
  return (
    <OptionItem
      onClick={() => {
        setShowKillReferendumPopup(true);
        setShow(false);
      }}
    >
      <div className="mr-2">
        <SystemTrash />
      </div>
      <span>Kill</span>
    </OptionItem>
  );
}

export function AppendMenuItem({ onClick }) {
  return (
    <OptionItem onClick={onClick}>
      <div className="mr-2">
        <InfoPlus />
      </div>
      <span>Append</span>
    </OptionItem>
  );
}
