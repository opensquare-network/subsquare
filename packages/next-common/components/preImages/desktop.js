import useColumns from "next-common/components/styledList/useColumns";
import { SecondaryCard } from "next-common/components/styled/containers/secondaryCard";
import { useState } from "react";
import useOldPreimage from "next-common/hooks/useOldPreimage";
import usePreimage from "next-common/hooks/usePreimage";
import { useDispatch, useSelector } from "react-redux";
import {
  incPreImagesTrigger,
  preImagesTriggerSelector,
} from "next-common/store/reducers/preImagesSlice";
import FieldLoading from "../icons/fieldLoading";
import ScrollerX from "next-common/components/styled/containers/scrollerX";
import DataList from "next-common/components/dataList";
import { Deposit, Hash, Proposal, Status } from "./fields";
import dynamicPopup from "next-common/lib/dynamic/popup";
import { isNil } from "lodash-es";

const PreimageDetailPopup = dynamicPopup(() => import("./preImageDetailPopup"));

function useCreatePreimageRow(
  hash,
  preimage,
  isStatusLoaded,
  isBytesLoaded,
  setShowArgumentsDetail,
) {
  const dispatch = useDispatch();
  const triggerUpdate = useSelector(preImagesTriggerSelector);
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
}

function PreimageRow({ DataListItem, hash, setShowArgumentsDetail }) {
  const [preimage, isStatusLoaded, isBytesLoaded] = usePreimage(hash);
  const row = useCreatePreimageRow(
    hash,
    preimage,
    isStatusLoaded,
    isBytesLoaded,
    setShowArgumentsDetail,
  );
  return <DataListItem row={row} />;
}

function OldPreimageRow({ DataListItem, hash, setShowArgumentsDetail }) {
  const [preimage, isStatusLoaded, isBytesLoaded] = useOldPreimage(hash);
  const row = useCreatePreimageRow(
    hash,
    preimage,
    isStatusLoaded,
    isBytesLoaded,
    setShowArgumentsDetail,
  );
  return <DataListItem row={row} />;
}

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

  return (
    <SecondaryCard>
      <ScrollerX>
        <DataList
          columns={columns}
          rows={data}
          noDataText="No current preimages"
          loading={loading}
          renderItem={(DataListItem, idx, rows) => {
            const {
              data: [hash],
              method,
            } = rows[idx];

            if (method === "requestStatusFor") {
              return (
                <PreimageRow
                  key={hash}
                  DataListItem={DataListItem}
                  hash={hash}
                  setShowArgumentsDetail={setShowArgumentsDetail}
                />
              );
            }

            return (
              <OldPreimageRow
                key={hash}
                DataListItem={DataListItem}
                hash={hash}
                setShowArgumentsDetail={setShowArgumentsDetail}
              />
            );
          }}
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
