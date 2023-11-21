import ScrollerX from "next-common/components/styled/containers/scrollerX";
import NoBorderList from "next-common/components/styledList/noBorderList";
import { ListCard } from "components/myvotes/styled";
import { useSelector } from "react-redux";
import {
  fetchMyMultisigs,
  myMultisigsSelector,
} from "next-common/store/reducers/multisigSlice";
import { AddressUser } from "next-common/components/user";
import Copyable from "next-common/components/copyable";
import { cn, textEllipsis } from "next-common/utils";
import { useCallback, useEffect, useState } from "react";
import CallPopup from "./callPopup";
import Tooltip from "next-common/components/tooltip";
import ExternalLink from "next-common/components/externalLink";
import { useChain } from "next-common/context/chain";
import Pagination from "next-common/components/pagination";
import { useDispatch } from "react-redux";
import { useUser } from "next-common/context/user";

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
          call={call}
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

const MultisigStatus = {
  Approving: "Approving",
  Cancelled: "Cancelled",
  Executed: "Executed",
};

function Status({ name }) {
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
      textColor = "text-green500";
      break;
    }
  }
  return <span className={cn("text-textPrimary", textColor)}>{name}</span>;
}

export default function DesktopList() {
  const dispatch = useDispatch();
  const chain = useChain();
  const user = useUser();
  const [page, setPage] = useState(1);
  const myMultisigs = useSelector(myMultisigsSelector);

  useEffect(() => {
    if (!user?.address) {
      return;
    }
    dispatch(fetchMyMultisigs(chain, user?.address, page));
    // dispatch(fetchMyMultisigs(chain, "13fnouKsAaWxBxCx9VarXBNyYo7vUCeTUbRmQBjytju8YqqB", page));
  }, [dispatch, chain, page, user?.address]);

  const onPageChange = useCallback((e, page) => {
    e.preventDefault();
    e.stopPropagation();
    setPage(page);
  }, []);

  const columns = [
    {
      name: "Address",
      style: { textAlign: "left", width: "128px", minWidth: "128px" },
    },
    {
      name: "When",
      style: { textAlign: "left", width: "128px", minWidth: "128px" },
    },
    {
      name: "Call",
      style: { textAlign: "left", minWidth: "280px" },
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

  const rows = (myMultisigs?.items || []).map((multisig) => [
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
      <Pagination {...myMultisigs} page={page} onPageChange={onPageChange} />
    </ListCard>
  );
}
