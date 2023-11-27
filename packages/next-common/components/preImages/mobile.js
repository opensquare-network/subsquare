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
import { Deposit, Hash, Proposal } from "./fields";
import tw from "tailwind-styled-components";

const FieldName = tw.span`text-textTertiary`;

function Item({ hash }) {
  const dispatch = useDispatch();
  const triggerUpdate = useSelector(preImagesTriggerSelector);
  const [preimage, isStatusLoaded, isBytesLoaded] = usePreimage(hash);
  const [showArgumentsDetail, setShowArgumentsDetail] = useState(null);

  return (
    <div className="flex flex-col py-[16px] gap-[12px] [&:not(:last-child)]:border-b [&:not(:last-child)]:border-neutral300">
      <div className="flex flex-col">
        <Hash
          key="hash"
          hash={hash}
          proposal={preimage.proposal}
          setShowArgumentsDetail={setShowArgumentsDetail}
        />
        <div className="flex justify-end">
          {isStatusLoaded ? (
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
          )}
        </div>
      </div>
      <div className="flex flex-col gap-[4px]">
        <div className="flex justify-between">
          <FieldName>Arguments</FieldName>
          {isBytesLoaded ? (
            <Proposal
              key="proposal"
              proposal={preimage.proposal}
              proposalError={preimage.proposalError}
              proposalWarning={preimage.proposalWarning}
              setShowArgumentsDetail={setShowArgumentsDetail}
            />
          ) : (
            <FieldLoading />
          )}
        </div>
        <div className="flex justify-between">
          <FieldName>Deposit Balance</FieldName>
          {isStatusLoaded ? (
            preimage.deposit && (
              <Deposit
                key="deposit"
                deposit={preimage.deposit}
                hash={hash}
                count={preimage.count}
                status={preimage.statusName}
                onUnnoteInBlock={() => dispatch(incPreImagesTrigger())}
                triggerUpdate={triggerUpdate}
                right
              />
            )
          ) : (
            <FieldLoading />
          )}
        </div>
        <div className="flex justify-between">
          <FieldName>Length</FieldName>
          {isStatusLoaded ? (
            <span className="text-textPrimary">
              {preimage.proposalLength?.toJSON()?.toLocaleString()}
            </span>
          ) : (
            <FieldLoading />
          )}
        </div>
      </div>
      {showArgumentsDetail && (
        <PreimageDetailPopup
          setShow={() => setShowArgumentsDetail(null)}
          proposal={showArgumentsDetail}
        />
      )}
    </div>
  );
}

export default function MobileList({ data }) {
  return (
    <SecondaryCard>
      {data.map(([hash]) => (
        <Item key={hash} hash={hash} />
      ))}
    </SecondaryCard>
  );
}
