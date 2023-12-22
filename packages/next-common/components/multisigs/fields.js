import Copyable from "next-common/components/copyable";
import { cn, textEllipsis } from "next-common/utils";
import { useState } from "react";
import CallPopup from "./callPopup";
import Tooltip from "next-common/components/tooltip";
import ExternalLink from "next-common/components/externalLink";
import { useChain } from "next-common/context/chain";
import ExplorerLink from "next-common/components/links/explorerLink";
import AddressUser from "next-common/components/user/addressUser";
import {
  SystemClose,
  SystemSignature,
  SystemVoteAbstain,
  SystemVoteAye,
} from "@osn/icons/subsquare";
import GhostButton from "../buttons/ghostButton";
import noop from "lodash.noop";
import useRealAddress from "next-common/utils/hooks/useRealAddress";

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

function AddressesTooltip({ addresses = [] }) {
  if (!addresses || addresses.length <= 0) {
    return null;
  }

  return (
    <ul>
      {(addresses || []).map((address, index) => (
        <li key={index} className="leading-5">
          <AddressUser
            add={address}
            ellipsis={false}
            color="var(--textPrimaryContrast)"
            fontSize={12}
          />
        </li>
      ))}
    </ul>
  );
}

export function Approving({ approvals, threshold }) {
  return (
    <div className="flex gap-[2px] text-textTertiary">
      <Tooltip content={<AddressesTooltip addresses={approvals} />}>
        <span className="text-textPrimary">{approvals?.length || 0}</span>
      </Tooltip>
      <span>/</span>
      <span>{threshold}</span>
    </div>
  );
}

export function Signatories({ signatories = [] }) {
  return (
    <Tooltip content={<AddressesTooltip addresses={signatories} />}>
      <span>{signatories?.length}</span>
    </Tooltip>
  );
}

export const MultisigStatus = {
  Approving: "Approving",
  Cancelled: "Cancelled",
  Executed: "Executed",
};

export function Status({ name, args = {}, updateAt }) {
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

  const textComponent = (
    <span className={cn("text14Medium", textColor)}>{name}</span>
  );

  if (updateAt) {
    return (
      <ExplorerLink indexer={updateAt} style={{ display: "inline" }}>
        {textComponent}
      </ExplorerLink>
    );
  }
  return textComponent;
}

export function SignStatus({ multisig = {} }) {
  const realAddress = useRealAddress();

  const { state, approvals } = multisig;
  const isApproved = approvals?.includes(realAddress);

  const name = state.name;

  let content;
  if (name === MultisigStatus.Approving) {
    content = (
      <>
        {isApproved && (
          <Tooltip content="Cancel">
            <SignStatusButton>
              <SystemClose className="w-4 h-4 [&_path]:stroke-textPrimary [&_path]:fill-textPrimary" />
            </SignStatusButton>
          </Tooltip>
        )}
        <Tooltip content="Sign">
          <SignStatusButton>
            <SystemSignature className="w-4 h-4 [&_path]:stroke-textPrimary [&_path]:stroke-2" />
          </SignStatusButton>
        </Tooltip>
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
