import React, { useState, useEffect, useRef } from "react";
import { useDispatch } from "react-redux";
import tw from "tailwind-styled-components";
import { SecondaryCard } from "next-common/components/styled/containers/secondaryCard";
import { incPreImagesTrigger } from "next-common/store/reducers/preImagesSlice";
import FieldLoading from "../../icons/fieldLoading";
import { Deposit, Hash, Proposal, Status } from "../fields";
import DetailButton from "../../detailButton";
import dynamicPopup from "next-common/lib/dynamic/popup";
import Loading from "next-common/components/loading";
import { cn } from "next-common/utils";
import { FixedSizeList } from "react-window";
import { useContextApi } from "next-common/context/api";
import { getPreimageTicket, getPreimageLen, getPreimageStatus } from "./common";

const PreimageDetailPopup = dynamicPopup(() =>
  import("../preImageDetailPopup"),
);

const FieldName = tw.span`text-textTertiary`;

function Item({ preimage, index }) {
  const api = useContextApi();
  const isApiLoading = !api;
  const dispatch = useDispatch();
  const [showArgumentsDetail, setShowArgumentsDetail] = useState(null);
  const statusName = getPreimageStatus(preimage);
  const ticket = getPreimageTicket(preimage);
  const len = getPreimageLen(preimage);

  return (
    <>
      <PreimageMobileListItemTemplate
        title={
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
          )
        }
        titleExtra={
          <DetailButton
            disabled={!preimage.proposal}
            onClick={() => setShowArgumentsDetail(preimage.proposal)}
          />
        }
        status={
          <Status
            key="status"
            statusName={statusName}
            count={preimage.requested?.count}
          />
        }
        hash={
          <Hash
            key="hash"
            hash={preimage.hash}
            proposal={preimage.proposal}
            setShowArgumentsDetail={setShowArgumentsDetail}
          />
        }
        depositBalance={
          ticket && (
            <Deposit
              key="deposit"
              deposit={ticket}
              hash={preimage.hash}
              count={preimage.count}
              status={statusName}
              onUnnoteInBlock={() => dispatch(incPreImagesTrigger())}
              right
            />
          )
        }
        length={
          <span className="text-textPrimary">{len?.toLocaleString()}</span>
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
  const listRef = useRef();

  useEffect(() => {
    if (listRef.current && data?.length) {
      listRef.current?.scrollTo(0, 0);
    }
  }, [data]);

  if (loading && data?.length === 0) {
    return <TableLoading />;
  }

  if (data?.length === 0) {
    return <NoDataText />;
  }

  const Row = ({ index, style }) => {
    return (
      <div style={style}>
        <Item preimage={data[index]} index={index} />
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
        ref={listRef}
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
