import ScrollerX from "next-common/components/styled/containers/scrollerX";
import NoBorderList from "next-common/components/styledList/noBorderList";
import { ListCard } from "components/myvotes/styled";
import { useSelector } from "react-redux";
import { myMultisigsSelector } from "next-common/store/reducers/multisigSlice";
import { AddressUser } from "next-common/components/user";
import Copyable from "next-common/components/copyable";
import { textEllipsis } from "next-common/utils";
import { useState } from "react";
import CallPopup from "./callPopup";
import Tooltip from "next-common/components/tooltip";
import ExternalLink from "next-common/components/externalLink";
import { useChain } from "next-common/context/chain";

function When({ height, index }) {
  const chain = useChain();
  return (
    <ExternalLink
      href={`https://${chain}.subscan.io/extrinsic/${height}-${index}`}
      className="flex cursor-pointer gap-[4px] text-textPrimary"
    >
      {height.toLocaleString()}-{index}
    </ExternalLink>
  );
}

function Call({ when, callHash, call, callHex }) {
  const [showPopup, setShowPopup] = useState(false);
  return (
    <div className="flex flex-col">
      <span
        className="cursor-pointer text14Medium"
        onClick={() => setShowPopup(true)}
      >
        {call?.section}.{call?.method}
      </span>
      <Copyable size={12} copyText={callHash}>
        <span className="text12Medium text-textTertiary">
          {textEllipsis(callHash, 6, 4)}
        </span>
      </Copyable>
      {showPopup && (
        <CallPopup
          callHex={callHex}
          blockHeight={when.height}
          setShow={setShowPopup}
        />
      )}
    </div>
  );
}

function Approving({ approvals, threshold }) {
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

function Signatories({ signatories, signatoriesCount }) {
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
      <span className="text-textPrimary">{signatoriesCount}</span>
    </Tooltip>
  );
}

function Status({ name }) {
  return <span className="text-textPrimary">{name}</span>;
}

export default function DesktopList() {
  const myMultisigs = useSelector(myMultisigsSelector);
  console.log(myMultisigs);

  const columns = [
    {
      name: "Address",
      style: {
        textAlign: "left",
        minWidth: "128px",
        maxWidth: 600,
        paddingRight: 16,
      },
    },
    {
      name: "When",
      style: { textAlign: "left", width: "128px", minWidth: "128px" },
    },
    {
      name: "Call",
      style: { textAlign: "left", width: "230px", minWidth: "128px" },
    },
    {
      name: "Approving",
      style: { textAlign: "left", width: "128px", minWidth: "128px" },
    },
    {
      name: "Signatories",
      style: { textAlign: "left", width: "128px", minWidth: "128px" },
    },
    {
      name: "Status",
      style: { textAlign: "left", width: "128px", minWidth: "128px" },
    },
  ];

  const rows = (myMultisigs?.multisigs || []).map((multisig) => [
    <AddressUser key="address" add={multisig.address} />,
    <When key="when" {...multisig?.when} />,
    <Call key="call" {...multisig} />,
    <Approving key="approving" {...multisig} />,
    <Signatories key="signatories" {...multisig} />,
    <Status key="status" {...multisig?.state} />,
  ]);

  return (
    <ListCard>
      <ScrollerX>
        <NoBorderList loading={false} columns={columns} rows={rows} />
      </ScrollerX>
    </ListCard>
  );
}
