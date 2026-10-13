import { useState } from "react";
import dynamicPopup from "next-common/lib/dynamic/popup";
import useColumns from "next-common/components/styledList/useColumns";
import { SecondaryCard } from "next-common/components/styled/containers/secondaryCard";
import ScrollerX from "next-common/components/styled/containers/scrollerX";
import VirtualList from "next-common/components/dataList/virtualList";
import { Deposit, Hash, Proposal, Status } from "../fields";
import { useDispatch } from "react-redux";
import { incPreImagesTrigger } from "next-common/store/reducers/preImagesSlice";
import { getPreimageTicket, getPreimageLen, getPreimageStatus } from "./common";
import { useWindowHeightContext } from "next-common/context/windowSize";

const PreimageDetailPopup = dynamicPopup(() =>
  import("../preImageDetailPopup"),
);

// The list holds every preimage of the chain, and the height of a row is fixed
// by the fields above it taking a single line each.
const ROW_HEIGHT = 73;
const DEFAULT_WINDOW_HEIGHT = 760;
const LIST_TOP_OFFSET = 340;

export default function DesktopList({ data, loading }) {
  const dispatch = useDispatch();
  const [showArgumentsDetail, setShowArgumentsDetail] = useState(null);
  const windowHeight = useWindowHeightContext() || DEFAULT_WINDOW_HEIGHT;
  const listHeight = Math.max(420, windowHeight - LIST_TOP_OFFSET);

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

  const rows = (data || []).map((preimage) => {
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
      <Proposal
        key="proposal"
        proposal={preimage.proposal}
        proposalError={preimage.proposalError}
        proposalWarning={preimage.proposalWarning}
        textPreimage={preimage.textPreimage}
        setShowArgumentsDetail={setShowArgumentsDetail}
      />,
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
        <VirtualList
          columns={columns}
          rows={rows}
          noDataText="No current preimages"
          loading={loading && !data}
          itemHeight={ROW_HEIGHT}
          listHeight={listHeight}
          overscanCount={5}
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
