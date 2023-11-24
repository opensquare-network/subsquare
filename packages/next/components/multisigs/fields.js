import Copyable from "next-common/components/copyable";
import { cn, textEllipsis } from "next-common/utils";
import { useState } from "react";
import CallPopup from "./callPopup";
import Tooltip from "next-common/components/tooltip";
import ExternalLink from "next-common/components/externalLink";
import { useChain } from "next-common/context/chain";

export function When({ height, index }) {
  const chain = useChain();
  return (
    <ExternalLink
      href={`https://${chain}.subscan.io/extrinsic/${height}-${index}`}
      className="hover:!underline flex cursor-pointer gap-[4px] text-textPrimary"
      externalIcon={false}
    >
      {height.toLocaleString()}-{index}
    </ExternalLink>
  );
}

export function Call({ when, callHash, call, callHex, right = false }) {
  const [showPopup, setShowPopup] = useState(false);

  return (
    <div className={cn("flex flex-col")}>
      {call ? (
        <span
          className={cn(
            "cursor-pointer text14Medium hover:underline",
            right ? "text-right" : "",
          )}
          onClick={() => setShowPopup(true)}
        >
          {call?.section}.{call?.method}
        </span>
      ) : (
        <span className={right ? "text-right" : ""}>--</span>
      )}
      <Copyable
        className={right ? "text-right" : ""}
        size={12}
        copyText={callHash}
      >
        <span className="text12Medium text-textTertiary">
          {textEllipsis(callHash, 6, 4)}
        </span>
      </Copyable>
      {showPopup && (
        <CallPopup
          call={call}
          callHex={callHex}
          blockHeight={when.height}
          setShow={setShowPopup}
        />
      )}
    </div>
  );
}

export function Approving({ approvals, threshold }) {
  let approvalsTip = null;
  if (approvals?.length > 0) {
    approvalsTip = (
      <ul>
        {approvals?.map((approval, index) => (
          <li key={`approval-${index}`}>{approval}</li>
        ))}
      </ul>
    );
  }

  return (
    <div className="flex gap-[2px] text-textTertiary">
      <Tooltip content={approvalsTip}>
        <span className="text-textPrimary">{approvals?.length || 0}</span>
      </Tooltip>
      <span>/</span>
      <span>{threshold}</span>
    </div>
  );
}

export function Signatories({ signatories = [] }) {
  let signatoriesTip = null;
  if (signatories?.length > 0) {
    signatoriesTip = (
      <ul>
        {signatories?.map((signatory, index) => (
          <li key={`signatory-${index}`}>{signatory}</li>
        ))}
      </ul>
    );
  }
  return (
    <Tooltip content={signatoriesTip}>
      <span className="text-textPrimary">{signatories?.length}</span>
    </Tooltip>
  );
}

export const MultisigStatus = {
  Approving: "Approving",
  Cancelled: "Cancelled",
  Executed: "Executed",
};

export function Status({ name, args = {} }) {
  let textColor = "";
  switch (name) {
    case MultisigStatus.Approving: {
      textColor = "text-theme500";
      break;
    }
    case MultisigStatus.Cancelled: {
      textColor = "text-red500";
      break;
    }
    case MultisigStatus.Executed: {
      const {
        result: { isErr },
      } = args || {};
      textColor = isErr ? "text-red500" : "text-green500";
      break;
    }
  }
  return <span className={cn("text14Medium", textColor)}>{name}</span>;
}
