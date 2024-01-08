import useColumns from "next-common/components/styledList/useColumns";
import { SecondaryCard } from "next-common/components/styled/containers/secondaryCard";
import { useState } from "react";
import useOldPreimage from "next-common/hooks/useOldPreimage";
import usePreimage from "next-common/hooks/usePreimage";
import PreimageDetailPopup from "./preImageDetailPopup";
import { useDispatch, useSelector } from "react-redux";
import {
  incPreImagesTrigger,
  preImagesTriggerSelector,
} from "next-common/store/reducers/preImagesSlice";
import FieldLoading from "../icons/fieldLoading";
import ScrollerX from "next-common/components/styled/containers/scrollerX";
import DataList from "next-common/components/dataList";
import { Deposit, Hash, Proposal, Status } from "./fields";

function createPreimageRowDataHook(usePreimage, hash, setShowArgumentsDetail) {
  return () => {
    const dispatch = useDispatch();
    const triggerUpdate = useSelector(preImagesTriggerSelector);
    const [preimage, isStatusLoaded, isBytesLoaded] = usePreimage(hash);
    const deposit = preimage?.ticket || preimage?.deposit;

    const row = [
      <Hash
        key="hash"
        hash={hash}
        proposal={preimage.proposal}
        setShowArgumentsDetail={setShowArgumentsDetail}
      />,
      isBytesLoaded ? (
        <Proposal
          key="proposal"
          proposal={preimage.proposal}
          proposalError={preimage.proposalError}
          proposalWarning={preimage.proposalWarning}
          setShowArgumentsDetail={setShowArgumentsDetail}
        />
      ) : (
        <FieldLoading />
      ),
      isStatusLoaded ? (
        deposit && (
          <Deposit
            key="deposit"
            deposit={deposit}
            hash={hash}
            count={preimage.count}
            status={preimage.statusName}
            onUnnoteInBlock={() => dispatch(incPreImagesTrigger())}
            triggerUpdate={triggerUpdate}
          />
        )
      ) : (
        <FieldLoading />
      ),
      isStatusLoaded ? (
        preimage.proposalLength?.toJSON()?.toLocaleString()
      ) : (
        <FieldLoading />
      ),
      isStatusLoaded ? (
        preimage.statusName && (
          <Status
            key="status"
            statusName={preimage.statusName}
            count={preimage.count}
          />
        )
      ) : (
        <FieldLoading />
      ),
    ];

    row.key = hash;

    return row;
  };
}

export default function DesktopList({ data }) {
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

  const rows = (data || []).map(({ data: [hash], method }) => {
    return {
      useData: createPreimageRowDataHook(
        method === "requestStatusFor" ? usePreimage : useOldPreimage,
        hash,
        setShowArgumentsDetail,
      ),
    };
  });

  return (
    <SecondaryCard>
      <ScrollerX>
        <DataList
          columns={columns}
          rows={rows}
          noDataText="No current preimages"
          loading={!data}
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
