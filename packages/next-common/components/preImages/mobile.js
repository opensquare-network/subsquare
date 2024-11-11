import { SecondaryCard } from "next-common/components/styled/containers/secondaryCard";
import { useState } from "react";
import usePreimage from "next-common/hooks/usePreimage";
import useOldPreimage from "next-common/hooks/useOldPreimage";
import { useDispatch, useSelector } from "react-redux";
import {
  incPreImagesTrigger,
  preImagesTriggerSelector,
} from "next-common/store/reducers/preImagesSlice";
import FieldLoading from "../icons/fieldLoading";
import { Deposit, Hash, Proposal, Status } from "./fields";
import tw from "tailwind-styled-components";
import DetailButton from "../detailButton";
import dynamicPopup from "next-common/lib/dynamic/popup";
import Loading from "next-common/components/loading";
import { cn } from "next-common/utils";
import { FixedSizeList } from "react-window";

const PreimageDetailPopup = dynamicPopup(() => import("./preImageDetailPopup"));

const FieldName = tw.span`text-textTertiary`;

function PreimageItem({ hash, index }) {
  const [preimage, isStatusLoaded, isBytesLoaded] = usePreimage(hash);
  return (
    <Item
      hash={hash}
      preimage={preimage}
      isStatusLoaded={isStatusLoaded}
      isBytesLoaded={isBytesLoaded}
      index={index}
    />
  );
}

function OldPreimageItem({ hash, index }) {
  const [preimage, isStatusLoaded, isBytesLoaded] = useOldPreimage(hash);
  return (
    <Item
      hash={hash}
      preimage={preimage}
      isStatusLoaded={isStatusLoaded}
      isBytesLoaded={isBytesLoaded}
      index={index}
    />
  );
}

function Item({ hash, preimage, isStatusLoaded, isBytesLoaded, index }) {
  const dispatch = useDispatch();
  const triggerUpdate = useSelector(preImagesTriggerSelector);
  const [showArgumentsDetail, setShowArgumentsDetail] = useState(null);
  const deposit = preimage?.ticket || preimage?.deposit;

  return (
    <>
      <PreimageMobileListItemTemplate
        title={
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
          )
        }
        titleExtra={
          <DetailButton
            disabled={!preimage.proposal}
            onClick={() => setShowArgumentsDetail(preimage.proposal)}
          />
        }
        status={
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
          )
        }
        hash={
          <Hash
            key="hash"
            hash={hash}
            proposal={preimage.proposal}
            setShowArgumentsDetail={setShowArgumentsDetail}
          />
        }
        depositBalance={
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
                right
              />
            )
          ) : (
            <FieldLoading />
          )
        }
        length={
          isStatusLoaded ? (
            <span className="text-textPrimary">
              {preimage.proposalLength?.toJSON()?.toLocaleString()}
            </span>
          ) : (
            <FieldLoading />
          )
        }
        index={index}
      />

      {showArgumentsDetail && (
        <PreimageDetailPopup
          setShow={() => setShowArgumentsDetail(null)}
          proposal={showArgumentsDetail}
        />
      )}
    </>
  );
}

function NoDataText() {
  return (
    <SecondaryCard className="flex justify-center">
      <div className="text14Medium text-textTertiary inline-flex items-center">
        No current preimages
      </div>
    </SecondaryCard>
  );
}

function TableLoading() {
  return (
    <SecondaryCard>
      <div className="flex w-full justify-center p-[8px]">
        <Loading size={20} />
      </div>
    </SecondaryCard>
  );
}

export default function MobileList({ data, loading }) {
  if (loading) {
    return <TableLoading />;
  }

  if (data?.length === 0) {
    return <NoDataText />;
  }

  const Row = ({ index, style }) => {
    const {
      data: [hash],
      method,
    } = data[index];
    return (
      <div style={style}>
        {method === "requestStatusFor" ? (
          <PreimageItem key={hash} hash={hash} index={index} />
        ) : (
          <OldPreimageItem key={hash} hash={hash} index={index} />
        )}
      </div>
    );
  };

  const itemSize = 210;
  const itemCount = data?.length || 0;
  const listHeight = itemCount >= 3 ? 680 : itemCount * itemSize;

  return (
    <SecondaryCard>
      <FixedSizeList
        height={listHeight}
        itemCount={itemCount}
        itemSize={itemSize}
        width="100%"
      >
        {Row}
      </FixedSizeList>
    </SecondaryCard>
  );
}

export function PreimageMobileListItemTemplate({
  title,
  titleExtra,
  status,
  hash,
  depositBalance,
  length,
  index,
}) {
  return (
    <div
      className={cn(
        "flex flex-col py-[16px] gap-[12px] text14Medium",
        index === 0 ? "" : "border-t border-neutral300",
      )}
    >
      <div className="flex flex-col gap-[12px]">
        <div className="flex justify-between gap-[24px]">
          {title}
          <div>{titleExtra}</div>
        </div>
        <div className="flex justify-end">{status}</div>
      </div>
      <div className="flex flex-col gap-[4px]">
        <div className="flex justify-between">
          <FieldName>Hash</FieldName>
          {hash}
        </div>
        <div className="flex justify-between">
          <FieldName>Deposit Balance</FieldName>
          {depositBalance}
        </div>
        <div className="flex justify-between">
          <FieldName>Length</FieldName>
          {length}
        </div>
      </div>
    </div>
  );
}
