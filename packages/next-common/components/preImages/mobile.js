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

const PreimageDetailPopup = dynamicPopup(() => import("./preImageDetailPopup"));

const FieldName = tw.span`text-textTertiary`;

function PreimageItem({ hash }) {
  const [preimage, isStatusLoaded, isBytesLoaded] = usePreimage(hash);
  return (
    <Item
      hash={hash}
      preimage={preimage}
      isStatusLoaded={isStatusLoaded}
      isBytesLoaded={isBytesLoaded}
    />
  );
}

function OldPreimageItem({ hash }) {
  const [preimage, isStatusLoaded, isBytesLoaded] = useOldPreimage(hash);
  return (
    <Item
      hash={hash}
      preimage={preimage}
      isStatusLoaded={isStatusLoaded}
      isBytesLoaded={isBytesLoaded}
    />
  );
}

function Item({ hash, preimage, isStatusLoaded, isBytesLoaded }) {
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

export default function MobileList({ data, loading }) {
  if (loading) {
    return (
      <SecondaryCard>
        <div className="flex w-full justify-center p-[8px]">
          <Loading size={20} />
        </div>
      </SecondaryCard>
    );
  }

  return (
    <SecondaryCard>
      {data?.map(({ data: [hash], method }) => {
        if (method === "requestStatusFor") {
          return <PreimageItem key={hash} hash={hash} />;
        }
        return <OldPreimageItem key={hash} hash={hash} />;
      })}
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
}) {
  return (
    <div className="flex flex-col py-[16px] gap-[12px] [&:not(:last-child)]:border-b [&:not(:last-child)]:border-neutral300 text14Medium">
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
