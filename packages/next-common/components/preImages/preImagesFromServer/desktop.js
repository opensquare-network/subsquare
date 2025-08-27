import { useState } from "react";
import dynamicPopup from "next-common/lib/dynamic/popup";
import useColumns from "next-common/components/styledList/useColumns";
import { SecondaryCard } from "next-common/components/styled/containers/secondaryCard";
import ScrollerX from "next-common/components/styled/containers/scrollerX";
import DataList from "next-common/components/dataList";
import { Deposit, Hash, Proposal, Status } from "../fields";

const PreimageDetailPopup = dynamicPopup(() =>
  import("../preImageDetailPopup"),
);

export default function DesktopList({ data, loading }) {
  const [showArgumentsDetail, setShowArgumentsDetail] = useState(null);

  const { columns } = useColumns([
    {
      name: "Hash",
      style: { textAlign: "left", width: "204px", minWidth: 204 },
    },
    {
      name: "Arguments",
      style: { textAlign: "left", minWidth: "388px" },
    },
    {
      name: "Depositor",
      style: { textAlign: "left", width: "160px", minWidth: "160px" },
    },
    {
      name: "Length",
      style: { textAlign: "right", width: "80px", minWidth: "80px" },
    },
    {
      name: "Status",
      style: { textAlign: "right", width: "160px", minWidth: "160px" },
    },
  ]);

  const rows = data.map((preimage) => {
    const deposit =
      preimage.requested?.maybeTicket || preimage.unrequested?.ticket;
    const len = preimage.requested?.maybeLen || preimage.unrequested?.len;
    const statusName = preimage.requested ? "Requested" : "Unrequested";

    return [
      <Hash
        key="hash"
        hash={preimage.hash}
        proposal={preimage.proposal}
        setShowArgumentsDetail={setShowArgumentsDetail}
      />,
      <Proposal
        key="proposal"
        proposal={preimage.proposal}
        proposalError={preimage.proposalError}
        proposalWarning={preimage.proposalWarning}
        setShowArgumentsDetail={setShowArgumentsDetail}
      />,
      deposit && (
        <Deposit
          key="deposit"
          deposit={deposit}
          hash={preimage.hash}
          count={preimage.requested?.count}
          status={statusName}
          onUnnoteInBlock={() => {}}
          triggerUpdate={() => {}}
        />
      ),
      len?.toLocaleString(),
      <Status
        key="status"
        statusName={statusName}
        count={preimage.requested?.count}
      />,
    ];
  });

  return (
    <SecondaryCard>
      <ScrollerX>
        <DataList
          columns={columns}
          rows={rows}
          noDataText="No current preimages"
          loading={loading}
        />
      </ScrollerX>
      {showArgumentsDetail && (
        <PreimageDetailPopup
          setShow={() => setShowArgumentsDetail(null)}
          proposal={showArgumentsDetail}
        />
      )}
    </SecondaryCard>
  );
}
