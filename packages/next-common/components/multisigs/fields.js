import Copyable from "next-common/components/copyable";
import { cn, textEllipsis } from "next-common/utils";
import { useState } from "react";
import Tooltip from "next-common/components/tooltip";
import ExternalLink from "next-common/components/externalLink";
import { useChain, useChainSettings } from "next-common/context/chain";
import ExplorerLink from "next-common/components/links/explorerLink";
import AddressUser from "next-common/components/user/addressUser";
import dynamicPopup from "next-common/lib/dynamic/popup";
import { sortAddresses } from "@polkadot/util-crypto";

const CallPopup = dynamicPopup(() => import("./callPopup"));

export function When({ height, index }) {
  const chain = useChain();
  const { integrations } = useChainSettings();
  if (!integrations?.subscan) {
    return null;
  }

  const domain = integrations.subscan.domain || chain;

  return (
    <ExternalLink
      href={`https://${domain}.subscan.io/extrinsic/${height}-${index}`}
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
            addressClassName="!text-textPrimaryContrast"
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
  const { ss58Format } = useChainSettings();
  const sortedSignatories = sortAddresses(signatories, ss58Format);

  return (
    <Tooltip content={<AddressesTooltip addresses={sortedSignatories} />}>
      <span>{sortedSignatories?.length}</span>
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

  return <span className={cn("text14Medium", textColor)}>{name}</span>;
}
