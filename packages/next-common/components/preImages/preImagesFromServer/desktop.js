import { useState } from "react";
import dynamicPopup from "next-common/lib/dynamic/popup";
import useColumns from "next-common/components/styledList/useColumns";
import { SecondaryCard } from "next-common/components/styled/containers/secondaryCard";
import ScrollerX from "next-common/components/styled/containers/scrollerX";
import DataList from "next-common/components/dataList";
import { Deposit, Hash, Proposal, Status } from "../fields";
import { useContextApi } from "next-common/context/api";
import FieldLoading from "next-common/components/icons/fieldLoading";
import { useDispatch } from "react-redux";
import { incPreImagesTrigger } from "next-common/store/reducers/preImagesSlice";
import { getPreimageTicket, getPreimageLen, getPreimageStatus } from "./common";

const PreimageDetailPopup = dynamicPopup(() =>
  import("../preImageDetailPopup"),
);

export default function DesktopList({ data, loading }) {
  const dispatch = useDispatch();
  const api = useContextApi();
  const isApiLoading = !api;
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
    const ticket = getPreimageTicket(preimage);
    const len = getPreimageLen(preimage);
    const statusName = getPreimageStatus(preimage);

    return [
      <Hash
        key="hash"
        hash={preimage.hash}
        proposal={preimage.proposal}
        setShowArgumentsDetail={setShowArgumentsDetail}
      />,
      isApiLoading ? (
        <FieldLoading />
      ) : (
        <Proposal
          key="proposal"
          proposal={preimage.proposal}
          proposalError={preimage.proposalError}
          proposalWarning={preimage.proposalWarning}
          setShowArgumentsDetail={setShowArgumentsDetail}
        />
      ),
      ticket && (
        <Deposit
          key="deposit"
          deposit={ticket}
          hash={preimage.hash}
          count={preimage.requested?.count}
          status={statusName}
          onUnnoteInBlock={() => dispatch(incPreImagesTrigger())}
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
