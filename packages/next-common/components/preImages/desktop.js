import useColumns from "next-common/components/styledList/useColumns";
import { SecondaryCard } from "next-common/components/styled/containers/secondaryCard";
import { useState } from "react";
import usePreimage from "next-common/hooks/usePreimage";
import PreimageDetailPopup from "./preImageDetailPopup";
import { useDispatch, useSelector } from "react-redux";
import {
  incPreImagesTrigger,
  preImagesTriggerSelector,
} from "next-common/store/reducers/preImagesSlice";
import FieldLoading from "../icons/fieldLoading";
import ScrollerX from "next-common/components/styled/containers/scrollerX";
import NoBorderList from "next-common/components/styledList/noBorderList";
import { Deposit, Hash, Proposal } from "./fields";

export default function DesktopList({ data }) {
  const [showArgumentsDetail, setShowArgumentsDetail] = useState(null);
  const { columns } = useColumns([
    {
      name: "Hash",
      style: { textAlign: "left", width: "220px" },
    },
    {
      name: "Arguments",
      style: { textAlign: "left", minWidth: "360px" },
    },
    {
      name: "Depositor",
      style: { textAlign: "left", width: "128px", minWidth: "128px" },
    },
    {
      name: "Length",
      style: { textAlign: "right", width: "128px", minWidth: "96px" },
    },
    {
      name: "Status",
      style: { textAlign: "right", width: "128px", minWidth: "128px" },
    },
  ]);

  const rows = (data || []).map(([hash]) => {
    return {
      useData: () => {
        const dispatch = useDispatch();
        const triggerUpdate = useSelector(preImagesTriggerSelector);
        const [preimage, isStatusLoaded, isBytesLoaded] = usePreimage(hash);
        console.log({ hash, preimage, isStatusLoaded, isBytesLoaded });

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
            preimage.deposit && (
              <Deposit
                key="deposit"
                deposit={preimage.deposit}
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
              <span
                key="status"
                className="capitalize text-textTertiary font-medium"
              >
                {preimage.statusName +
                  (preimage.count ? `(${preimage.count})` : "")}
              </span>
            )
          ) : (
            <FieldLoading />
          ),
        ];

        row.key = hash;

        return row;
      },
    };
  });

  return (
    <SecondaryCard>
      <ScrollerX>
        <NoBorderList
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
